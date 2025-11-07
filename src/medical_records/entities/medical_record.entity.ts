import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Player } from "../../players/entities/player.entity";

@Entity("medical_records")
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.medical_records)
  player: Player;

  @Column()
  diagnosis: string;

  @Column("text")
  treatment: string;

  @Column()
  doctor_name: string;

  @Column({ type: "date" })
  check_date: Date;

  @Column({ type: "date" })
  recovery_date: Date;

  @Column("text")
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
