import { ApiProperty } from "@nestjs/swagger";
import { Gender, PlayerPosition } from "../entities/player.entity";

export class CreatePlayerDto {
  @ApiProperty({ example: "Cristiano" })
  first_name: string;

  @ApiProperty({ example: "Ronaldo" })
  last_name: string;

  @ApiProperty({ type: "string", format: "date" })
  birth_date: Date;

  @ApiProperty({ example: "Portugal" })
  nationality: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  gender: Gender;

  @ApiProperty({ enum: PlayerPosition, example: PlayerPosition.FORWARD })
  position: PlayerPosition;

  @ApiProperty({ example: 187.5 })
  height_cm: number;

  @ApiProperty({ example: 83.2 })
  weight_kg: number;

  @ApiProperty({ type: "string", format: "date" })
  joined_date: Date;

  @ApiProperty({ example: "Lisbon, Portugal" })
  address: string;

  @ApiProperty({ example: 1 })
  teamId: number;

  @ApiProperty({ example: 2 })
  userId: number;
}
