import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsDateString, IsOptional, IsEnum } from "class-validator";
import { EnrollmentStatus } from "../entities/enrollment.entity";

export class CreateEnrollmentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  playerId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  courseId: number; 

  @ApiProperty({ type: "string", format: "date" })
  @IsDateString()
  enrollment_date: string;

  @ApiProperty({ enum: EnrollmentStatus, example: EnrollmentStatus.ACTIVE })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;

  @ApiProperty({ example: 85.5, required: false })
  @IsOptional()
  @IsNumber()
  grade?: number;
}
