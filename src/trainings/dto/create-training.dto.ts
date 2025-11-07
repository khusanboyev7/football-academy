import { ApiProperty } from "@nestjs/swagger";

export class CreateTrainingDto {
  @ApiProperty({ example: 1 })
  teamId: number;

  @ApiProperty({ example: 2 })
  coachId: number;

  @ApiProperty({ type: "string", format: "date" })
  date: Date;

  @ApiProperty({ example: "15:00" })
  start_time: string;

  @ApiProperty({ example: "17:00" })
  end_time: string;

  @ApiProperty({ example: "Defensive drills" })
  focus_area: string;
}
