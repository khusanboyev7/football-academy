import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "admin@gmail.com", 
    description: "Foydalanuvchi emaili",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "12345",
    description: "Foydalanuvchi paroli",
  })
  @IsNotEmpty()
  password: string;
}
