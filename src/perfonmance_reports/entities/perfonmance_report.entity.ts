import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Player } from "../../players/entities/player.entity";
import { Coach } from "../../coaches/entities/coach.entity";

@Entity("performance_reports")
export class PerformanceReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.performance_reports, {
    onDelete: "CASCADE",
  })
  player: Player;

  @ManyToOne(() => Coach, (coach) => coach.performance_reports, {
    onDelete: "CASCADE",
  })
  coach: Coach;

  @Column({ type: "date" })
  report_date: Date;

  @Column("text")
  strengths: string;

  @Column("text")
  weaknesses: string;

  @Column("text")
  recommendations: string;

  @Column("decimal", { precision: 3, scale: 2 })
  overall_score: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
