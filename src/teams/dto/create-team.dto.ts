import { ApiProperty } from "@nestjs/swagger";
import { TeamCategory } from "../entities/team.entity";

export class CreateTeamDto {
  @ApiProperty({ example: "Juventus U21" })
  name: string;

  @ApiProperty({ example: "U21" })
  age_group: string;

  @ApiProperty({ enum: TeamCategory, example: TeamCategory.JUNIOR })
  category: TeamCategory;

  @ApiProperty({ example: "Main Stadium" })
  training_field: string;

  @ApiProperty({ example: 1 })
  coachId: number;
}
