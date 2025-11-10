import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsEnum, IsNumber } from "class-validator";
import { LicenceLevel } from "../entities/coach.entity";

export class CreateCoachDto {
  @ApiProperty({ example: "John" })
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  lastName: string;

  @ApiProperty({ example: "john.doe@gmail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "+998901234567" })
  @IsString()
  phone: string;

  @ApiProperty({ enum: LicenceLevel, example: LicenceLevel.LOCAL })
  @IsEnum(LicenceLevel)
  licenseLevel: LicenceLevel;

  @ApiProperty({ example: "Defender Specialist" })
  @IsString()
  specialty: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  userId: number;
}
