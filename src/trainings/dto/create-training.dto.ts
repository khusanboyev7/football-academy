import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsDateString, IsString } from "class-validator";

export class CreateTrainingDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  teamId: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsNotEmpty()
  coachId: number;

  @ApiProperty({ type: "string", format: "date" })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: "15:00" })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({ example: "17:00" })
  @IsString()
  @IsNotEmpty()
  end_time: string;

  @ApiProperty({ example: "Defensive drills" })
  @IsString()
  @IsNotEmpty()
  focus_area: string;
}
