import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsEnum } from "class-validator";
import { Role } from "../../common/enum/role.enum";

export class RefreshTokenDto {
  @ApiProperty({ example: 1, description: "User ID to refresh token" })
  @IsNumber()
  userId: number;

  @ApiProperty({
    enum: Role,
    example: Role.PLAYER,
    description: "Role of the user",
  })
  @IsEnum(Role)
  role: Role;
}
