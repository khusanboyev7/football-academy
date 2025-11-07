import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString, IsOptional, IsEnum } from "class-validator";
import { Role } from "../../common/enum/role.enum";

export class CreateUserDto {
  @ApiProperty({ example: "user@gmail.com", description: "User email" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "userPassword123", description: "User password" })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    example: "+998901234567",
    description: "User phone number",
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: Role, description: "Optional role for user" })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
