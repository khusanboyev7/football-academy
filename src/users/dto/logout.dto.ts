import { ApiProperty } from "@nestjs/swagger";

export class LogoutDto {
  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "strongPassword123" })
  password: string;
}
