import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "super@admin.com",
    description: "Foydalanuvchi emaili",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "super12345",
    description: "Foydalanuvchi paroli",
  })
  @IsNotEmpty()
  password: string;
}
