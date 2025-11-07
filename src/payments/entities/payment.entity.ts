import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Player } from "../../players/entities/player.entity";
import { Enrollment } from "../../enrollments/entities/enrollment.entity";

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  TRANSFER = "transfer",
}

export enum PaymentStatus {
  PAID = "paid",
  PENDING = "pending",
  FAILED = "failed",
}

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.payments)
  player: Player;

  @OneToOne(() => Enrollment, (enroll) => enroll.payment)
  enrollment: Enrollment;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "date" })
  payment_date: Date;

  @Column({ type: "enum", enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ type: "enum", enum: PaymentStatus })
  status: PaymentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
