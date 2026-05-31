import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeasonService {
  constructor(private prisma: PrismaService) {}

  // ---- TEMPORADAS ----
  getSeasonsByLeague(leagueId: string) {
    return this.prisma.season.findMany({
      where: { leagueId },
      orderBy: { name: 'desc' },
    });
  }

  getAllSeasons() {
    return this.prisma.season.findMany({
      include: { league: { include: { sport: true } } },
      orderBy: { name: 'desc' },
    });
  }

  createSeason(data: { name: string; leagueId: string; startDate?: string; endDate?: string; current?: boolean }) {
    const transformedData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    };
    
    return this.prisma.season.create({ data: transformedData });
  }

  // season.service.ts - Versión corregida
  updateSeason(id: string, data: any) {
    const { league, id: _id, ...rest } = data;
    
    // Convertir fechas al formato ISO-8601 si existen
    const transformedData = {
      ...rest,
      startDate: rest.startDate ? new Date(rest.startDate).toISOString() : undefined,
      endDate: rest.endDate ? new Date(rest.endDate).toISOString() : undefined,
    };
    
    return this.prisma.season.update({
      where: { id },
      data: transformedData,
    });
  }

  deleteSeason(id: string) {
    return this.prisma.season.delete({
      where: { id }
    });
  }

  async setCurrentSeason(id: string) {
    const season = await this.prisma.season.findUnique({ where: { id } });
    if (!season) throw new NotFoundException('Temporada no encontrada');

    // Desactivar todas las temporadas de esa liga
    await this.prisma.season.updateMany({
      where: { leagueId: season.leagueId },
      data: { current: false },
    });

    // Activar la seleccionada
    return this.prisma.season.update({
      where: { id },
      data: { current: true },
    });
  }

  // ---- PLANTILLAS POR TEMPORADA ----
  getSquadBySeason(teamId: string, seasonId: string) {
    return this.prisma.playerSeasonTeam.findMany({
      where: { teamId, seasonId },
      include: {
        player: {
          include: {
            position: true,
          },
        },
        season: true,
      },
      orderBy: { player: { jerseyNumber: 'asc' } },
    });
  }
  async addPlayerToSeason(playerId: string, teamId: string, seasonId: string, note?: string) {
    return this.prisma.playerSeasonTeam.upsert({
      where: { playerId_teamId_seasonId: { playerId, teamId, seasonId } },
      update: { isActive: true, note: note ?? null },
      create: { playerId, teamId, seasonId, isActive: true, note: note ?? null },
    });
  }
  async removePlayerFromSeason(playerId: string, teamId: string, seasonId: string) {
    return this.prisma.playerSeasonTeam.update({
      where: { playerId_teamId_seasonId: { playerId, teamId, seasonId } },
      data: { isActive: false },
    });
  }
  async deletePlayerFromSeason(playerId: string, teamId: string, seasonId: string) {
    return this.prisma.playerSeasonTeam.delete({
      where: { playerId_teamId_seasonId: { playerId, teamId, seasonId } },
    });
  }
  async updatePlayerSeasonNote(playerId: string, teamId: string, seasonId: string, note: string, isActive: boolean) {
    return this.prisma.playerSeasonTeam.update({
      where: { playerId_teamId_seasonId: { playerId, teamId, seasonId } },
      data: { note, isActive },
    });
  }

  // Historial completo de un jugador por temporadas
  getPlayerHistory(playerId: string) {
    return this.prisma.playerSeasonTeam.findMany({
      where: { playerId },
      include: {
        team:   { select: { id: true, name: true, slug: true, logoUrl: true } },
        season: { include: { league: true } },
      },
      orderBy: { season: { name: 'desc' } },
    });
  }

  // Plantilla actual de un equipo (temporada activa)
  async getCurrentSquad(teamId: string) {
    const currentSeasons = await this.prisma.season.findMany({
      where: { current: true },
    });

    if (!currentSeasons.length) {
      // Si no hay temporada activa, devolver jugadores actuales del equipo
      return this.prisma.player.findMany({
        where: { teamId, active: true },
        include: { position: true },
        orderBy: { jerseyNumber: 'asc' },
      });
    }

    const seasonIds = currentSeasons.map(s => s.id);
    return this.prisma.playerSeasonTeam.findMany({
      where: { teamId, seasonId: { in: seasonIds }, isActive: true },
      include: {
        player:   { include: { position: true } },
        season:   { include: { league: true } },
      },
      orderBy: { player: { jerseyNumber: 'asc' } },
    });
  }

  // Temporalmente, agrega este método en season.service.ts
  async findAllLeagues() {
    return this.prisma.league.findMany({
      select: { id: true, name: true, slug: true }
    });
  }
}