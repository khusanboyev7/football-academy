import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Coach } from "../../coaches/entities/coach.entity";
import { Player } from "../../players/entities/player.entity";
import { Match } from "../../matches/entities/match.entity";
import { Training } from "../../trainings/entities/training.entity";

export enum TeamCategory {
  JUNIOR = "junior",
  SENIOR = "senior",
  ELITE = "elite",
}

@Entity("teams")
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age_group: string;

  @Column({ type: "enum", enum: TeamCategory })
  category: TeamCategory;

  @Column()
  training_field: string;

  @ManyToOne(() => Coach, (coach) => coach.teams, { onDelete: "SET NULL" })
  coach: Coach;

  @OneToMany(() => Player, (player) => player.team)
  players: Player[];

  @OneToMany(() => Match, (match) => match.home_team)
  home_matches: Match[];

  @OneToMany(() => Match, (match) => match.away_team)
  away_matches: Match[];

  @OneToMany(() => Training, (training) => training.team)
  trainings: Training[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
