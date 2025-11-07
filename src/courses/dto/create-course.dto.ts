import { ApiProperty } from "@nestjs/swagger";

export class CreateCourseDto {
  @ApiProperty({ example: "Advanced Football Techniques" })
  title: string;

  @ApiProperty({ example: "Course description here" })
  description: string;

  @ApiProperty({ example: 40 })
  duration_hours: number;

  @ApiProperty({ type: "string", format: "date" })
  start_date: Date;

  @ApiProperty({ type: "string", format: "date" })
  end_date: Date;

  @ApiProperty({ example: 120.5 })
  price: number;

  @ApiProperty({ example: 1 })
  coachId: number;
}
