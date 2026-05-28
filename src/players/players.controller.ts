import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private players: PlayersService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.players.findAll(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.players.findOne(slug);
  }
}
