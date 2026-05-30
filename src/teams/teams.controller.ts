import { Controller, Get, Param, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { QueryTeamDto } from './dto/query-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private teams: TeamsService) {}

  @Get()
  findAll(@Query() query: QueryTeamDto) { return this.teams.findAll(query); }

  @Get(':slug')
  findOne(@Param('slug') slug: string) { return this.teams.findOne(slug); }

  @Get(':slug/stats')
  getStats(@Param('slug') slug: string) { return this.teams.getSeasonStats(slug); }

  @Get(':slug/seasons')
  getSeasons(@Param('slug') slug: string) { return this.teams.getTeamSeasons(slug); }

  @Get(':slug/squad/:seasonId')
  getSquad(@Param('slug') slug: string, @Param('seasonId') seasonId: string) {
    return this.teams.getSquadBySeason(slug, seasonId);
  }
}