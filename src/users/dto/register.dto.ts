import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength, IsNotEmpty } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "user@gmail.com",
    description: "Foydalanuvchi email manzili",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "StrongPassword123!",
    description: "Foydalanuvchi paroli",
  })
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: "+998901234567",
    description: "Foydalanuvchi telefon raqami",
  })
  @IsNotEmpty()
  phone: string;
}
