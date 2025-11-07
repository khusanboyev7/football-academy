import { ApiProperty } from "@nestjs/swagger";
import { EnrollmentStatus } from "../entities/enrollment.entity";

export class CreateEnrollmentDto {
  @ApiProperty({ example: 1 })
  playerId: number;

  @ApiProperty({ example: 2 })
  courseId: number;

  @ApiProperty({ type: "string", format: "date" })
  enrollment_date: Date;

  @ApiProperty({ enum: EnrollmentStatus, example: EnrollmentStatus.ACTIVE })
  status: EnrollmentStatus;

  @ApiProperty({ example: 85.5, required: false })
  grade?: number;
}
