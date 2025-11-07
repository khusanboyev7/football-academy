import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Team } from "../../teams/entities/team.entity";
import { PlayerStatistic } from "../../player_statistics/entities/player_statistic.entity";

@Entity("matches")
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, (team) => team.home_matches)
  home_team: Team;

  @ManyToOne(() => Team, (team) => team.away_matches)
  away_team: Team;

  @Column({ type: "date" })
  date: Date;

  @Column()
  location: string;

  @Column()
  home_score: number;

  @Column()
  away_score: number;

  @Column()
  competition: string;

  @OneToMany(() => PlayerStatistic, (stat) => stat.match)
  player_statistics: PlayerStatistic[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
