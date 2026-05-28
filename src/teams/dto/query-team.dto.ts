import { IsOptional, IsString } from 'class-validator';

export class QueryTeamDto {
  @IsOptional() @IsString() sport?: string;
  @IsOptional() @IsString() league?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() search?: string;
}
