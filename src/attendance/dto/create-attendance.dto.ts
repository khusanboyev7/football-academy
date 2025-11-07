import { ApiProperty } from "@nestjs/swagger";

export class CreateAttendanceDto {
  @ApiProperty({ example: 1 })
  playerId: number;

  @ApiProperty({ example: 2 })
  trainingId: number;

  @ApiProperty({ example: true })
  attended: boolean;

  @ApiProperty({ example: "Was sick", required: false })
  reason?: string;
}
