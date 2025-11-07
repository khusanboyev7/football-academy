import { ApiProperty } from "@nestjs/swagger";

export class CreateMatchDto {
  @ApiProperty({ example: 1 })
  home_teamId: number;

  @ApiProperty({ example: 2 })
  away_teamId: number;

  @ApiProperty({ type: "string", format: "date" })
  date: Date;

  @ApiProperty({ example: "Main Stadium" })
  location: string;

  @ApiProperty({ example: 2 })
  home_score: number;

  @ApiProperty({ example: 1 })
  away_score: number;

  @ApiProperty({ example: "U21 League" })
  competition: string;
}
