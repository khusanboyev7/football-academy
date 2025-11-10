import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsNumber } from "class-validator";
import { TeamCategory } from "../entities/team.entity";

export class CreateTeamDto {
  @ApiProperty({ example: "Juventus U21" })
  @IsString()
  name: string;

  @ApiProperty({ example: "U21" })
  @IsString()
  age_group: string;

  @ApiProperty({ enum: TeamCategory, example: TeamCategory.JUNIOR })
  @IsEnum(TeamCategory)
  category: TeamCategory;

  @ApiProperty({ example: "Main Stadium" })
  @IsString()
  training_field: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  coachId: number; 
}
