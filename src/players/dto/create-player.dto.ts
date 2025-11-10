import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsNumber, IsDateString, Min } from "class-validator";
import { Gender, PlayerPosition } from "../entities/player.entity";

export class CreatePlayerDto {
  @ApiProperty({ example: "Cristiano" })
  @IsString()
  first_name: string;

  @ApiProperty({ example: "Ronaldo" })
  @IsString()
  last_name: string;

  @ApiProperty({ type: "string", format: "date" })
  @IsDateString()
  birth_date: string;

  @ApiProperty({ example: "Portugal" })
  @IsString()
  nationality: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ enum: PlayerPosition, example: PlayerPosition.FORWARD })
  @IsEnum(PlayerPosition)
  position: PlayerPosition;

  @ApiProperty({ example: 187.5 })
  @IsNumber()
  height_cm: number;

  @ApiProperty({ example: 83.2 })
  @IsNumber()
  weight_kg: number;

  @ApiProperty({ type: "string", format: "date" })
  @IsDateString()
  joined_date: string;

  @ApiProperty({ example: "Lisbon, Portugal" })
  @IsString()
  address: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  team: number; 

  @ApiProperty({ example: 2 })
  @IsNumber()
  user: number; 
}
