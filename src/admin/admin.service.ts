import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private upload: UploadService,
  ) {}

  // ---- TEAMS ----
  getTeams(query: any) {
    return this.prisma.team.findMany({
      where: query.search ? { name: { contains: query.search, mode: 'insensitive' } } : {},
      include: {
        stadium: { select: { name: true } },
        leagues: { include: { league: { include: { sport: true } } } },
        _count: { select: { players: true } },
      },
      orderBy: { name: 'asc' },
    });
  }
  createTeam(data: any) {
    const { leagueId, stadiumId, ...rest } = data;
    return this.prisma.team.create({
      data: {
        ...rest,
        slug: slugify(data.name),
        ...(stadiumId && { stadiumId }),
        ...(leagueId && {
          leagues: { create: { leagueId } }
        }),
      },
    });
  }
  updateTeam(id: string, data: any) {
    const { 
      leagueId, stadiumId, 
      // Quitar campos que no son columnas directas
      stadium, leagues, players, seasonStats, 
      titles, history, favoritedBy, recentlyViewed,
      _count, createdAt, updatedAt,
      ...rest 
    } = data;
    
    return this.prisma.team.update({
      where: { id },
      data: {
        ...rest,
        ...(data.name && { slug: data.slug || rest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }),
        ...(stadiumId && { stadiumId }),
      },
    });
  }
  deleteTeam(id: string) {
    return this.prisma.team.delete({ where: { id } });
  }
  async uploadTeamLogo(id: string, file: Express.Multer.File) {
    const url = await this.upload.uploadImage(file, 'teams');
    return this.prisma.team.update({ where: { id }, data: { logoUrl: url } });
  }

  // ---- PLAYERS ----
  getPlayers(query: any) {
    return this.prisma.player.findMany({
      where: {
        ...(query.teamId && { teamId: query.teamId }),
        ...(query.search && {
          OR: [
            { firstName: { contains: query.search, mode: 'insensitive' } },
            { lastName:  { contains: query.search, mode: 'insensitive' } },
          ]
        }),
      },
      include: {
        position: true,
        team: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { jerseyNumber: 'asc' },
    });
  }
  createPlayer(data: any) {
    const { positionId, teamId, ...rest } = data;
    return this.prisma.player.create({
      data: {
        ...rest,
        slug: slugify(`${data.firstName}-${data.lastName}-${Date.now()}`),
        ...(positionId && { positionId }),
        ...(teamId && { teamId }),
      },
    });
  }
  updatePlayer(id: string, data: any) {
    const { 
      positionId, teamId, slug,
      // Quitar campos no permitidos
      position, team, seasonStats, followedBy, recentlyViewed,
      id: _id, createdAt, updatedAt, active,
      ...rest 
    } = data;
    
    return this.prisma.player.update({
      where: { id },
      data: {
        ...rest,
        ...(positionId && { positionId }),
        ...(teamId && { teamId }),
      },
    });
  }
  deletePlayer(id: string) {
    return this.prisma.player.delete({ where: { id } });
  }
  async uploadPlayerPhoto(id: string, file: Express.Multer.File) {
    const url = await this.upload.uploadImage(file, 'players');
    return this.prisma.player.update({ where: { id }, data: { photoUrl: url } });
  }

  // ---- STADIUMS ----
  getStadiums() {
    return this.prisma.stadium.findMany({
      include: { 
        team: { 
          select: { 
            id: true,     
            name: true,
            logoUrl: true, 
            city: true,
            country: true
          } 
        } 
      },
      orderBy: { name: 'asc' },
    });
  }
  async createStadium(data: any) {
    const { teamId, ...rest } = data;
    
    const createData: any = { ...rest };
    
    if (teamId) {
      createData.team = { connect: { id: teamId } };
    }
    
    return this.prisma.stadium.create({
      data: createData,
      include: { team: true }
    });
  }
  updateStadium(id: string, data: any) {
    const {
    team,        
    teamId,      
    id: _id, 
    createdAt, 
    updatedAt,
    ...rest      
  } = data;
    
   // Construir el objeto de actualización
    const updateData: any = { ...rest };
    
    // Manejar la relación con Team (usando connect/disconnect)
    if (teamId !== undefined) {
      if (teamId === null || teamId === '') {
        // Desconectar el equipo actual
        updateData.team = { disconnect: true };
      } else {
        // Conectar al equipo especificado
        updateData.team = { connect: { id: teamId } };
      }
    }
    
    return this.prisma.stadium.update({
      where: { id },
      data: updateData,
      include: { team: true } // Incluir el equipo en la respuesta
    });
  }
  async uploadStadiumImage(id: string, file: Express.Multer.File) {
    const url = await this.upload.uploadImage(file, 'stadiums');
    return this.prisma.stadium.update({ where: { id }, data: { imageUrl: url } });
  }

  // ---- LEAGUES ----
  async getLeagues() {
    return this.prisma.league.findMany({
      include: { 
        sport: true,
        teams: {
          include: { team: true } 
        },
        _count: { select: { teams: true } } 
      },
      orderBy: { name: 'asc' },
    });
  }
  async createLeague(data: any) {
    const { sportId, sport, _count, teamIds, ...rest } = data;
    if (!sportId) throw new Error('sportId es requerido');
    
    const slug = rest.slug || rest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Usamos una transacción para crear la liga y sus relaciones
    return this.prisma.$transaction(async (tx) => {
      const league = await tx.league.create({
        data: { ...rest, slug, sportId },
      });

      // Si vienen equipos al crear, los asociamos en team_leagues
      if (teamIds && teamIds.length > 0) {
        await tx.teamLeague.createMany({
          data: teamIds.map((teamId: string) => ({
            leagueId: league.id,
            teamId: teamId,
            active: true
          }))
        });
      }

      return league;
    });
  }
  async updateLeague(id: string, data: any) {
    const {
      sport, teams, seasons, id: _id, createdAt, updatedAt, _count,
      teamIds,
      // Estos campos son los que NO están en el modelo League
      // logoUrl SÍ está en el modelo, así que NO lo excluimos
      ...rest
    } = data;
    
    return this.prisma.$transaction(async (tx) => {
      // 1. Actualizamos los datos básicos de la liga
      // rest incluye: name, sportId, country, season, logoUrl, description, etc.
      const updatedLeague = await tx.league.update({
        where: { id },
        data: rest,
      });

      // 2. Sincronizar equipos si es necesario
      if (teamIds !== undefined) {
        await tx.teamLeague.deleteMany({
          where: { leagueId: id }
        });

        if (teamIds.length > 0) {
          await tx.teamLeague.createMany({
            data: teamIds.map((teamId: string) => ({
              leagueId: id,
              teamId: teamId,
              active: true
            }))
          });
        }
      }

      return updatedLeague;
    });
  }
  async deleteLeague(id: string) {
    // Primero eliminar las relaciones en teamLeague
    await this.prisma.teamLeague.deleteMany({
      where: { leagueId: id }
    });
    
    // Luego eliminar la liga
    return this.prisma.league.delete({ 
      where: { id } 
    });
  }
  async uploadLeagueLogo(id: string, file: Express.Multer.File) {
    const url = await this.upload.uploadImage(file, 'leagues');
    return this.prisma.league.update({ 
      where: { id }, 
      data: { logoUrl: url } 
    });
  }

  // ---- USERS ----
  getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true, createdAt: true,
        _count: { select: { favoriteTeams: true, followedPlayers: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  updateUserRole(id: string, role: 'USER' | 'ADMIN') {
    return this.prisma.user.update({ where: { id }, data: { role } });
  }

  // ---- DASHBOARD STATS ----
  async getDashboardStats() {
    const [teams, players, stadiums, users, leagues] = await Promise.all([
      this.prisma.team.count(),
      this.prisma.player.count(),
      this.prisma.stadium.count(),
      this.prisma.user.count(),
      this.prisma.league.count(),
    ]);
    return { teams, players, stadiums, users, leagues };
  }

  // TRANSFERS
  async transferPlayer(playerId: string, toTeamId: string | null, description?: string) {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      select: { id: true, firstName: true, lastName: true, teamId: true },
    });
    if (!player) throw new NotFoundException('Jugador no encontrado');
    await this.prisma.transfer.create({
      data: { playerId, fromTeamId: player.teamId ?? null, toTeamId: toTeamId ?? null, description: description ?? null },
    });
    return this.prisma.player.update({
      where: { id: playerId },
      data: { teamId: toTeamId ?? null, active: true },
      include: { team: { select: { id: true, name: true, slug: true, logoUrl: true } }, position: true },
    });
  }
  getTransfers(playerId?: string) {
    return this.prisma.transfer.findMany({
      where: playerId ? { playerId } : {},
      include: {
        player:   { select: { id: true, firstName: true, lastName: true, photoUrl: true } },
        fromTeam: { select: { id: true, name: true, logoUrl: true } },
        toTeam:   { select: { id: true, name: true, logoUrl: true } },
      },
      orderBy: { date: 'desc' },
      take: 50,
    });
  }
  getFreeAgents() {
    return this.prisma.player.findMany({
      where: { teamId: null },
      include: { position: true },
      orderBy: { lastName: 'asc' },
    });
  }
}
