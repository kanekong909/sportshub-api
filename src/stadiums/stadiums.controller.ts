import { Controller, Get, Param, Query } from '@nestjs/common';
import { StadiumsService } from './stadiums.service';

@Controller('stadiums')
export class StadiumsController {
  constructor(private stadiums: StadiumsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.stadiums.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stadiums.findOne(id);
  }
}
