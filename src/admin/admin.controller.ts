import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Query, UseGuards, UseInterceptors,
  UploadedFile, Request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { SeasonService } from './season.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private admin: AdminService, private seasons: SeasonService) {}

  // ---- EQUIPOS ----
  @Get('teams')
  getTeams(@Query() q: any) { return this.admin.getTeams(q); }

  @Post('teams')
  createTeam(@Body() body: any) { return this.admin.createTeam(body); }

  @Put('teams/:id')
  updateTeam(@Param('id') id: string, @Body() body: any) {
    return this.admin.updateTeam(id, body);
  }

  @Delete('teams/:id')
  deleteTeam(@Param('id') id: string) { return this.admin.deleteTeam(id); }

  @Post('teams/:id/logo')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadTeamLogo(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.admin.uploadTeamLogo(id, file);
  }

  // ---- JUGADORES ----
  @Get('players')
  getPlayers(@Query() q: any) { return this.admin.getPlayers(q); }

  @Post('players')
  createPlayer(@Body() body: any) { return this.admin.createPlayer(body); }

  @Put('players/:id')
  updatePlayer(@Param('id') id: string, @Body() body: any) {
    return this.admin.updatePlayer(id, body);
  }

  @Delete('players/:id')
  deletePlayer(@Param('id') id: string) { return this.admin.deletePlayer(id); }

  @Post('players/:id/photo')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadPlayerPhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.admin.uploadPlayerPhoto(id, file);
  }

  // ---- ESTADIOS ----
  @Get('stadiums')
  getStadiums() { return this.admin.getStadiums(); }

  @Post('stadiums')
  createStadium(@Body() body: any) { return this.admin.createStadium(body); }

  @Put('stadiums/:id')
  updateStadium(@Param('id') id: string, @Body() body: any) {
    return this.admin.updateStadium(id, body);
  }

  @Post('stadiums/:id/image')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadStadiumImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.admin.uploadStadiumImage(id, file);
  }

  // ---- LIGAS ----
  @Get('leagues')
  getLeagues() { return this.admin.getLeagues(); }

  @Post('leagues')
  createLeague(@Body() body: any) { return this.admin.createLeague(body); }

  @Put('leagues/:id')
  updateLeague(@Param('id') id: string, @Body() body: any) {
    return this.admin.updateLeague(id, body);
  }
  @Delete('leagues/:id')
  deleteLeague(@Param('id') id: string) {
    return this.admin.deleteLeague(id);
  }
  @Post('leagues/:id/upload-logo')
  @UseInterceptors(FileInterceptor('file'))
  uploadLeagueLogo(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.admin.uploadLeagueLogo(id, file);
  }

  // ---- USUARIOS ----
  @Get('users')
  getUsers() { return this.admin.getUsers(); }

  @Patch('users/:id/role')
  updateRole(@Param('id') id: string, @Body() body: { role: 'USER' | 'ADMIN' }) {
    return this.admin.updateUserRole(id, body.role);
  }

  // ---- STATS ----
  @Get('stats')
  getDashboardStats() { return this.admin.getDashboardStats(); }

  // TRANSFERS
  @Get('transfers')
  getTransfers(@Query('playerId') playerId?: string) { return this.admin.getTransfers(playerId); }

  @Post('transfers')
  transferPlayer(@Body() body: { playerId: string; toTeamId: string | null; description?: string }) {
    return this.admin.transferPlayer(body.playerId, body.toTeamId, body.description);
  }

  @Get('free-agents')
  getFreeAgents() { return this.admin.getFreeAgents(); }

  // STATS
  // NUEVOS ENDPOINTS PARA STATS
  @Get('team-season-stats')
  getTeamSeasonStats(@Query() query: any) {
    return this.admin.getTeamSeasonStats(query);
  }

  @Post('team-season-stats')
  createTeamSeasonStat(@Body() data: any) {
    return this.admin.createTeamSeasonStat(data);
  }

  @Put('team-season-stats/:id')
  updateTeamSeasonStat(@Param('id') id: string, @Body() data: any) {
    return this.admin.updateTeamSeasonStat(id, data);
  }

  // Temporada
  @Get('seasons')
  async getSeasons(@Query('leagueId') leagueId?: string) {
    return leagueId 
      ? this.seasons.getSeasonsByLeague(leagueId)
      : this.seasons.getAllSeasons();
  }

  @Post('seasons')
  async createSeason(@Body() body: any) {
    return this.seasons.createSeason(body);
  }

  @Put('seasons/:id')
  async updateSeason(@Param('id') id: string, @Body() body: any) {
    return this.seasons.updateSeason(id, body);
  }

  @Patch('seasons/:id/set-current')
  async setCurrentSeason(@Param('id') id: string) {
    return this.seasons.setCurrentSeason(id);
  }

  @Delete('seasons/:id')
  async deleteSeason(@Param('id') id: string) {
    return this.seasons.deleteSeason(id);
  }
}
