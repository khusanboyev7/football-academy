import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Player } from "../../players/entities/player.entity";
import { Match } from "../../matches/entities/match.entity";

@Entity("player_statistics")
export class PlayerStatistic {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.statistics, {
    onDelete: "CASCADE",
  })
  player: Player;

  @ManyToOne(() => Match, (match) => match.player_statistics, {
    onDelete: "CASCADE",
  })
  match: Match;

  @Column()
  goals: number;

  @Column()
  assists: number;

  @Column()
  yellow_cards: number;

  @Column()
  red_cards: number;

  @Column()
  minutes_played: number;

  @Column("decimal", { precision: 3, scale: 2 })
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
