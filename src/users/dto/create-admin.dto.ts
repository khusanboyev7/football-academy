import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength, IsEnum } from "class-validator";
import { Role } from "../../common/enum/role.enum";

export class CreateAdminDto {
  @ApiProperty({ example: "admin@gmail.com", description: "Admin email" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "strongPassword123", description: "Admin password" })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "John Doe", description: "Full name of admin" })
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    enum: Role,
    example: Role.ADMIN,
    description: "Role of admin",
  })
  @IsEnum(Role)
  role: Role;
}
