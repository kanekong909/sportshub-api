import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

@Injectable()
export class CoachesService {
  constructor(private prisma: PrismaService) {}

  findAll(query?: { search?: string; nationality?: string }) {
    return this.prisma.coach.findMany({
      where: {
        active: true,
        ...(query?.search && {
          OR: [
            { firstName: { contains: query.search, mode: 'insensitive' } },
            { lastName:  { contains: query.search, mode: 'insensitive' } },
          ],
        }),
        ...(query?.nationality && { nationality: query.nationality }),
      },
      include: {
        seasonTeams: {
          where:   { isActive: true },
          include: { team: { select: { id: true, name: true, slug: true, logoUrl: true } } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastName: 'asc' },
    });
  }

  async findOne(slug: string) {
    const coach = await this.prisma.coach.findUnique({
      where: { slug },
      include: {
        seasonTeams: {
          include: {
            team:   { select: { id: true, name: true, slug: true, logoUrl: true, primaryColor: true } },
            season: { include: { league: true } },
          },
          orderBy: { season: { name: 'desc' } },
        },
        stats: {
          include: {
            team:    { select: { name: true, logoUrl: true } },
            season2: true,
          },
          orderBy: { season: 'desc' },
        },
      },
    });
    if (!coach) throw new NotFoundException(`Entrenador "${slug}" no encontrado`);
    return coach;
  }

  getTeamCoaches(teamId: string) {
    return this.prisma.coachSeasonTeam.findMany({
      where:   { teamId, isActive: true },
      include: { coach: true, season: true },
      orderBy: { role: 'asc' },
    });
  }

  adminGetAll(query?: any) {
    return this.prisma.coach.findMany({
      where: query?.search ? {
        OR: [
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName:  { contains: query.search, mode: 'insensitive' } },
        ],
      } : {},
      include: {
        seasonTeams: {
          where:   { isActive: true },
          include: { team: { select: { name: true } }, season: { select: { name: true } } },
          take: 1,
        },
      },
      orderBy: { lastName: 'asc' },
    });
  }

  create(data: any) {
    const { seasonTeams, stats, ...rest } = data;
    
    if (rest.birthDate && typeof rest.birthDate === 'string') {
      rest.birthDate = rest.birthDate ? new Date(rest.birthDate) : null;
    }

    return this.prisma.coach.create({
      data: { ...rest, slug: slugify(`${data.firstName}-${data.lastName}`) },
    });
  }

  update(id: string, data: any) {
    const { id: _id, createdAt, updatedAt, seasonTeams, stats, slug, ...rest } = data;
    
    // Convertir birthDate a DateTime si viene como string de fecha
    if (rest.birthDate && typeof rest.birthDate === 'string') {
      rest.birthDate = rest.birthDate ? new Date(rest.birthDate) : null;
    }

    return this.prisma.coach.update({ where: { id }, data: rest });
  }

  delete(id: string) {
    return this.prisma.coach.delete({ where: { id } });
  }

  async uploadPhoto(id: string, url: string) {
    return this.prisma.coach.update({ where: { id }, data: { photoUrl: url } });
  }

  getCoachSeasons(coachId: string) {
    return this.prisma.coachSeasonTeam.findMany({
      where:   { coachId },
      include: {
        team:   { select: { id: true, name: true, logoUrl: true } },
        season: { include: { league: true } },
      },
      orderBy: { season: { name: 'desc' } },
    });
  }

  getSquadCoaches(teamId: string, seasonId: string) {
    return this.prisma.coachSeasonTeam.findMany({
      where:   { teamId, seasonId },
      include: { coach: true, season: true },
      orderBy: { role: 'asc' },
    });
  }

  async addCoachToSeason(coachId: string, teamId: string, seasonId: string, role: string, note?: string) {
    return this.prisma.coachSeasonTeam.upsert({
      where:  { coachId_teamId_seasonId: { coachId, teamId, seasonId } },
      update: { isActive: true, role: role as any, note: note ?? null },
      create: { coachId, teamId, seasonId, role: role as any, isActive: true, note: note ?? null },
    });
  }

  async updateCoachSeason(coachId: string, teamId: string, seasonId: string, data: any) {
    return this.prisma.coachSeasonTeam.update({
      where: { coachId_teamId_seasonId: { coachId, teamId, seasonId } },
      data:  { ...data, ...(data.role && { role: data.role as any }) },
    });
  }

  async removeCoachFromSeason(coachId: string, teamId: string, seasonId: string) {
    return this.prisma.coachSeasonTeam.delete({
      where: { coachId_teamId_seasonId: { coachId, teamId, seasonId } },
    });
  }

  upsertStats(coachId: string, teamId: string, season: string, data: any) {
    return this.prisma.coachStats.upsert({
      where:  { coachId_teamId_season: { coachId, teamId, season } },
      update: data,
      create: { coachId, teamId, season, ...data },
    });
  }
}