import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StadiumsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { country?: string; search?: string }) {
    return this.prisma.stadium.findMany({
      where: {
        ...(query.country && { country: query.country }),
        ...(query.search && { name: { contains: query.search, mode: 'insensitive' } }),
      },
      include: { team: { select: { name: true, slug: true, logoUrl: true } } },
      orderBy: { capacity: 'desc' },
    });
  }

  async findOne(id: string) {
    const stadium = await this.prisma.stadium.findUnique({
      where: { id },
      include: { team: true },
    });
    if (!stadium) throw new NotFoundException('Estadio no encontrado');
    return stadium;
  }
}
