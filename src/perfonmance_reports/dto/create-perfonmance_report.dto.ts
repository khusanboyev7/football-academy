import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsDateString,
  IsString,
  IsNumber,
} from "class-validator";

export class CreatePerformanceReportDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  playerId: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsNotEmpty()
  coachId: number;

  @ApiProperty({ type: "string", format: "date" })
  @IsDateString()
  report_date: string;

  @ApiProperty({ example: "Strong passing, shooting" })
  @IsString()
  strengths: string;

  @ApiProperty({ example: "Weak defense, stamina" })
  @IsString()
  weaknesses: string;

  @ApiProperty({ example: "Improve stamina, positioning" })
  @IsString()
  recommendations: string;

  @ApiProperty({ example: 8.5 })
  @IsNumber()
  overall_score: number;
}
