import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Query, UseGuards, UseInterceptors, UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CoachesService } from './coaches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UploadService } from '../upload/upload.service';

@Controller('coaches')
export class CoachesController {
  constructor(
    private coaches: CoachesService,
    private upload: UploadService,
  ) {}

  // ---- PÚBLICOS ----
  @Get()
  findAll(@Query() query: any) { return this.coaches.findAll(query); }

  @Get(':slug')
  findOne(@Param('slug') slug: string) { return this.coaches.findOne(slug); }

  // ---- ADMIN ----
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  adminGetAll(@Query() query: any) { return this.coaches.adminGetAll(query); }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  create(@Body() body: any) { return this.coaches.create(body); }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  update(@Param('id') id: string, @Body() body: any) { return this.coaches.update(id, body); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  delete(@Param('id') id: string) { return this.coaches.delete(id); }

  @Post(':id/photo')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadPhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (file) {
      const url = await this.upload.uploadImage(file, 'coaches');
      return this.coaches.uploadPhoto(id, url);
    }
    return this.coaches.uploadPhoto(id, body.photoUrl);
  }

  // ---- TEMPORADAS ----
  @Get(':id/seasons')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  getSeasons(@Param('id') id: string) { return this.coaches.getCoachSeasons(id); }

  @Post('season/assign')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  addToSeason(@Body() body: { coachId: string; teamId: string; seasonId: string; role: string; note?: string }) {
    return this.coaches.addCoachToSeason(body.coachId, body.teamId, body.seasonId, body.role, body.note);
  }

  @Put('season/update')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  updateSeason(@Body() body: { coachId: string; teamId: string; seasonId: string; role?: string; isActive?: boolean; note?: string }) {
    const { coachId, teamId, seasonId, ...data } = body;
    return this.coaches.updateCoachSeason(coachId, teamId, seasonId, data);
  }

  @Delete('season/remove')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  removeFromSeason(@Body() body: { coachId: string; teamId: string; seasonId: string }) {
    return this.coaches.removeCoachFromSeason(body.coachId, body.teamId, body.seasonId);
  }

  @Get('squad/:teamId/:seasonId')
  getSquadCoaches(@Param('teamId') teamId: string, @Param('seasonId') seasonId: string) {
    return this.coaches.getSquadCoaches(teamId, seasonId);
  }

  // ---- STATS ----
  @Post(':id/stats')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  upsertStats(@Param('id') id: string, @Body() body: { teamId: string; season: string; data: any }) {
    return this.coaches.upsertStats(id, body.teamId, body.season, body.data);
  }
}