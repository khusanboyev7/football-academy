import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateAttendanceDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  playerId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  trainingId: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  attended: boolean;

  @ApiProperty({ example: "Was sick", required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
