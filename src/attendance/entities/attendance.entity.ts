import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Player } from "../../players/entities/player.entity";
import { Training } from "../../trainings/entities/training.entity";

@Entity("attendance")
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.attendance, {
    onDelete: "CASCADE",
  })
  player: Player;

  @ManyToOne(() => Training, (training) => training.attendance, {
    onDelete: "CASCADE",
  })
  training: Training;

  @Column({ default: false })
  attended: boolean;

  @Column({ nullable: true })
  reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
