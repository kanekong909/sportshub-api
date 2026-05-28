import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryTeamDto } from './dto/query-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryTeamDto) {
    return this.prisma.team.findMany({
      where: {
        ...(query.search && {
          name: { contains: query.search, mode: 'insensitive' },
        }),
        ...(query.country && { country: query.country }),
        leagues: query.sport || query.league ? {
          some: {
            league: {
              ...(query.league && { slug: query.league }),
              ...(query.sport && { sport: { slug: query.sport } }),
            },
          },
        } : undefined,
      },
      include: {
        stadium: { select: { name: true, capacity: true, city: true } },
        leagues: { include: { league: { include: { sport: true } } } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(slug: string) {
    const team = await this.prisma.team.findUnique({
      where: { slug },
      include: {
        stadium: true,
        leagues: { include: { league: { include: { sport: true } } } },
        players: {
          where: { active: true },
          include: { position: true },
          orderBy: { jerseyNumber: 'asc' },
        },
        seasonStats: { orderBy: { season: 'desc' }, take: 5 },
        titles: { orderBy: { year: 'desc' } },
        history: { orderBy: { year: 'asc' } },
      },
    });
    if (!team) throw new NotFoundException(`Equipo "${slug}" no encontrado`);
    return team;
  }

  async getSeasonStats(slug: string) {
    const team = await this.prisma.team.findUnique({ where: { slug } });
    if (!team) throw new NotFoundException();
    return this.prisma.teamSeasonStats.findMany({
      where: { teamId: team.id },
      include: { league: true },
      orderBy: { season: 'desc' },
    });
  }
}
