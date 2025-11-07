import { ApiProperty } from "@nestjs/swagger";
import { LicenceLevel } from "../entities/coach.entity";

export class CreateCoachDto {
  @ApiProperty({ example: "John" })
  first_name: string;

  @ApiProperty({ example: "Doe" })
  last_name: string;

  @ApiProperty({ example: "john.doe@gmail.com" })
  email: string;

  @ApiProperty({ example: "+998901234567" })
  phone: string;

  @ApiProperty({ enum: LicenceLevel, example: LicenceLevel.LOCAL })
  license_level: LicenceLevel;

  @ApiProperty({ example: "Defender Specialist" })
  specialty: string;

  @ApiProperty({ example: 1 })
  userId: number;
}
