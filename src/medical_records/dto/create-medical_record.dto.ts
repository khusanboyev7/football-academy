import { ApiProperty } from "@nestjs/swagger";

export class CreateMedicalRecordDto {
  @ApiProperty({ example: 1 })
  playerId: number;

  @ApiProperty({ example: "Sprained ankle" })
  diagnosis: string;

  @ApiProperty({ example: "Rest and physiotherapy" })
  treatment: string;

  @ApiProperty({ example: "Dr. Smith" })
  doctor_name: string;

  @ApiProperty({ type: "string", format: "date" })
  check_date: Date;

  @ApiProperty({ type: "string", format: "date" })
  recovery_date: Date;

  @ApiProperty({ example: "Detailed description of injury" })
  description: string;
}
