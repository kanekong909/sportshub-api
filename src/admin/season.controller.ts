import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { SeasonService } from './season.service';

@Controller('admin/seasons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SeasonController {
  constructor(private seasons: SeasonService) {}

  @Get()
  getAll(@Query('leagueId') leagueId?: string) {
    return leagueId
      ? this.seasons.getSeasonsByLeague(leagueId)
      : this.seasons.getAllSeasons();
  }

  @Post()
  create(@Body() body: any) { return this.seasons.createSeason(body); }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.seasons.updateSeason(id, body); }

  @Patch(':id/current')
  setCurrent(@Param('id') id: string) { return this.seasons.setCurrentSeason(id); }

  // ---- PLANTILLAS ----
  @Get('squad')
  getSquad(@Query('teamId') teamId: string, @Query('seasonId') seasonId: string) {
    return this.seasons.getSquadBySeason(teamId, seasonId);
  }

  @Post('squad')
  addPlayer(@Body() body: { playerId: string; teamId: string; seasonId: string; note?: string }) {
    return this.seasons.addPlayerToSeason(body.playerId, body.teamId, body.seasonId, body.note);
  }

  @Delete('squad/remove')
  deletePlayer(@Body() body: { playerId: string; teamId: string; seasonId: string }) {
    return this.seasons.deletePlayerFromSeason(body.playerId, body.teamId, body.seasonId);
  }

 @Put('squad/note')
  updateNote(@Body() body: { playerId: string; teamId: string; seasonId: string; note: string; isActive: boolean; photoUrl?: string }) {
    return this.seasons.updatePlayerSeasonNote(
      body.playerId, body.teamId, body.seasonId, 
      body.note, body.isActive, body.photoUrl
    );
  }

  @Get('player/:playerId/history')
  getPlayerHistory(@Param('playerId') playerId: string) {
    return this.seasons.getPlayerHistory(playerId);
  }

  @Get('team/:teamId/current')
  getCurrentSquad(@Param('teamId') teamId: string) {
    return this.seasons.getCurrentSquad(teamId);
  }

  @Put('squad/photo')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  updateSeasonPhoto(@Body() body: { playerId: string; teamId: string; seasonId: string; photoUrl: string }) {
    return this.seasons.updatePlayerSeasonNote(
      body.playerId, body.teamId, body.seasonId,
      '', true, body.photoUrl
    );
  }
}