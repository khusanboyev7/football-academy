import { ApiProperty } from "@nestjs/swagger";

export class CreatePerformanceReportDto {
  @ApiProperty({ example: 1 })
  playerId: number;

  @ApiProperty({ example: 2 })
  coachId: number;

  @ApiProperty({ type: "string", format: "date" })
  report_date: Date;

  @ApiProperty({ example: "Strong passing, shooting" })
  strengths: string;

  @ApiProperty({ example: "Weak defense, stamina" })
  weaknesses: string;

  @ApiProperty({ example: "Improve stamina, positioning" })
  recommendations: string;

  @ApiProperty({ example: 8.5 })
  overall_score: number;
}
