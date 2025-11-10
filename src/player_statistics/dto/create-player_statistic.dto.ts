import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsNumber } from "class-validator";

export class CreatePlayerStatisticDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  playerId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  matchId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  goals: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  assists: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  yellow_cards: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  red_cards: number;

  @ApiProperty({ example: 90 })
  @IsInt()
  minutes_played: number;

  @ApiProperty({ example: 8.5 })
  @IsNumber()
  rating: number;
}
