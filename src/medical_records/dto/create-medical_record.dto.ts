import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, IsDateString } from "class-validator";

export class CreateMedicalRecordDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  player: number; 

  @ApiProperty({ example: "Sprained ankle" })
  @IsString()
  diagnosis: string;

  @ApiProperty({ example: "Rest and physiotherapy" })
  @IsString()
  treatment: string;

  @ApiProperty({ example: "Dr. Smith" })
  @IsString()
  doctor_name: string;

  @ApiProperty({ type: "string", format: "date" })
  @IsDateString()
  check_date: string;

  @ApiProperty({ type: "string", format: "date" })
  @IsDateString()
  recovery_date: string;

  @ApiProperty({ example: "Detailed description of injury" })
  @IsString()
  @IsOptional()
  description?: string;
}
