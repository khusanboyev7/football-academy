import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsDateString, IsString, Min } from "class-validator";

export class CreateMatchDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  home_team: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  away_team: number;

  @ApiProperty({ type: "string", format: "date" })
  @IsDateString()
  date: string;

  @ApiProperty({ example: "Main Stadium" })
  @IsString()
  location: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  home_score: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  away_score: number;

  @ApiProperty({ example: "U21 League" })
  @IsString()
  competition: string;
}
