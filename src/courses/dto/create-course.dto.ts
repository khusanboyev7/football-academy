import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsDateString, IsOptional } from "class-validator";

export class CreateCourseDto {
  @ApiProperty({ example: "Advanced Football Techniques" })
  @IsString()
  title: string;

  @ApiProperty({ example: "Course description here" })
  @IsString()
  description: string;

  @ApiProperty({ example: 40 })
  @IsNumber()
  duration_hours: number;

  @ApiProperty({ type: "string", format: "date" })
  @IsDateString()
  start_date: string;

  @ApiProperty({ type: "string", format: "date" })
  @IsDateString()
  end_date: string;

  @ApiProperty({ example: 120.5 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  coach: number; 
}
