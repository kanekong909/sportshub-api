import { Controller, Get, Param, Query, UseGuards, Request, Post, Delete } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { QueryTeamDto } from './dto/query-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('teams')
export class TeamsController {
  constructor(private teams: TeamsService) {}

  @Get()
  findAll(@Query() query: QueryTeamDto) {
    return this.teams.findAll(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.teams.findOne(slug);
  }

  @Get(':slug/stats')
  getStats(@Param('slug') slug: string) {
    return this.teams.getSeasonStats(slug);
  }
}
