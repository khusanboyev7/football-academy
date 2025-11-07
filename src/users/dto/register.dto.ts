import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from "class-validator";
import { Role } from "../../common/enum/role.enum";

export class RegisterDto {
  @ApiProperty({ example: "user@gmail.com", description: "User email" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "strongPassword123", description: "User password" })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "+998901234567", description: "User phone number" })
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.PLAYER,
    description: "Optional role for registration",
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
