import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users/me')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  getProfile(@Request() req) {
    return this.users.getProfile(req.user.id);
  }

  @Get('favorites')
  getFavorites(@Request() req) {
    return this.users.getFavoriteTeams(req.user.id);
  }

  @Post('favorites/:teamId')
  addFavorite(@Request() req, @Param('teamId') teamId: string) {
    return this.users.addFavoriteTeam(req.user.id, teamId);
  }

  @Delete('favorites/:teamId')
  removeFavorite(@Request() req, @Param('teamId') teamId: string) {
    return this.users.removeFavoriteTeam(req.user.id, teamId);
  }

  @Get('players')
  getFollowed(@Request() req) {
    return this.users.getFollowedPlayers(req.user.id);
  }

  @Post('players/:playerId')
  followPlayer(@Request() req, @Param('playerId') playerId: string) {
    return this.users.followPlayer(req.user.id, playerId);
  }

  @Delete('players/:playerId')
  unfollowPlayer(@Request() req, @Param('playerId') playerId: string) {
    return this.users.unfollowPlayer(req.user.id, playerId);
  }

  @Get('notes')
  getNotes(@Request() req) {
    return this.users.getNotes(req.user.id);
  }

  @Post('notes')
  upsertNote(@Request() req, @Body() body: { entityType: string; entityId: string; content: string }) {
    return this.users.upsertNote(req.user.id, body.entityType, body.entityId, body.content);
  }

  @Delete('notes/:noteId')
  deleteNote(@Request() req, @Param('noteId') noteId: string) {
    return this.users.deleteNote(req.user.id, noteId);
  }

  @Get('history')
  getHistory(@Request() req) {
    return this.users.getRecentlyViewed(req.user.id);
  }

  @Post('history')
  addHistory(@Request() req, @Body() body: { entityType: string; entityId: string }) {
    return this.users.addRecentlyViewed(req.user.id, body.entityType, body.entityId);
  }
}
