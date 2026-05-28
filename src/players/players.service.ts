import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { sport?: string; teamSlug?: string; search?: string; position?: string }) {
    return this.prisma.player.findMany({
      where: {
        active: true,
        ...(query.search && {
          OR: [
            { firstName: { contains: query.search, mode: 'insensitive' } },
            { lastName: { contains: query.search, mode: 'insensitive' } },
          ],
        }),
        ...(query.teamSlug && { team: { slug: query.teamSlug } }),
        ...(query.position && { position: { code: query.position } }),
      },
      include: {
        position: true,
        team: { select: { id: true, name: true, slug: true, logoUrl: true } },
      },
      orderBy: { lastName: 'asc' },
    });
  }

  async findOne(slug: string) {
    const player = await this.prisma.player.findUnique({
      where: { slug },
      include: {
        position: { include: { sport: true } },
        team: { select: { id: true, name: true, slug: true, logoUrl: true } },
        seasonStats: { orderBy: { season: 'desc' } },
      },
    });
    if (!player) throw new NotFoundException(`Jugador "${slug}" no encontrado`);
    return player;
  }
}
