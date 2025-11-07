import { ApiProperty } from "@nestjs/swagger";

export class CreatePlayerStatisticDto {
  @ApiProperty({ example: 1 })
  playerId: number;

  @ApiProperty({ example: 1 })
  matchId: number;

  @ApiProperty({ example: 2 })
  goals: number;

  @ApiProperty({ example: 1 })
  assists: number;

  @ApiProperty({ example: 0 })
  yellow_cards: number;

  @ApiProperty({ example: 0 })
  red_cards: number;

  @ApiProperty({ example: 90 })
  minutes_played: number;

  @ApiProperty({ example: 8.5 })
  rating: number;
}
