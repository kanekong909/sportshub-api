import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, avatar: true, createdAt: true,
        _count: {
          select: { favoriteTeams: true, followedPlayers: true, notes: true },
        },
      },
    });
  }

  // ---- Equipos favoritos ----
  async getFavoriteTeams(userId: string) {
    return this.prisma.userFavoriteTeam.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            stadium: { select: { name: true } },
            leagues: { include: { league: { include: { sport: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addFavoriteTeam(userId: string, teamId: string) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundException('Equipo no encontrado');
    return this.prisma.userFavoriteTeam.upsert({
      where: { userId_teamId: { userId, teamId } },
      create: { userId, teamId },
      update: {},
    });
  }

  async removeFavoriteTeam(userId: string, teamId: string) {
    return this.prisma.userFavoriteTeam.delete({
      where: { userId_teamId: { userId, teamId } },
    });
  }

  // ---- Jugadores seguidos ----
  async getFollowedPlayers(userId: string) {
    return this.prisma.userFollowedPlayer.findMany({
      where: { userId },
      include: {
        player: {
          include: {
            position: true,
            team: { select: { name: true, slug: true, logoUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async followPlayer(userId: string, playerId: string) {
    return this.prisma.userFollowedPlayer.upsert({
      where: { userId_playerId: { userId, playerId } },
      create: { userId, playerId },
      update: {},
    });
  }

  async unfollowPlayer(userId: string, playerId: string) {
    return this.prisma.userFollowedPlayer.delete({
      where: { userId_playerId: { userId, playerId } },
    });
  }

  // ---- Notas ----
  async getNotes(userId: string) {
    return this.prisma.userNote.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async upsertNote(userId: string, entityType: string, entityId: string, content: string) {
    const existing = await this.prisma.userNote.findFirst({
      where: { userId, entityType, entityId },
    });
    if (existing) {
      return this.prisma.userNote.update({
        where: { id: existing.id },
        data: { content },
      });
    }
    return this.prisma.userNote.create({
      data: { userId, entityType, entityId, content },
    });
  }

  async deleteNote(userId: string, noteId: string) {
    return this.prisma.userNote.deleteMany({
      where: { id: noteId, userId },
    });
  }

  // ---- Historial ----
  async getRecentlyViewed(userId: string) {
    return this.prisma.recentlyViewed.findMany({
      where: { userId },
      include: {
        team: { select: { name: true, slug: true, logoUrl: true } },
        player: { select: { firstName: true, lastName: true, slug: true, photoUrl: true } },
      },
      orderBy: { viewedAt: 'desc' },
      take: 20,
    });
  }

  async addRecentlyViewed(userId: string, entityType: string, entityId: string) {
    await this.prisma.recentlyViewed.deleteMany({
      where: { userId, entityType, entityId },
    });
    return this.prisma.recentlyViewed.create({
      data: {
        userId, entityType, entityId,
        ...(entityType === 'team' && { teamId: entityId }),
        ...(entityType === 'player' && { playerId: entityId }),
      },
    });
  }
}
