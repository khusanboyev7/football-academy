import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Player } from "../../players/entities/player.entity";
import { Course } from "../../courses/entities/course.entity";
import { Payment } from "../../payments/entities/payment.entity";

export enum EnrollmentStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  DROPPED = "dropped",
}

@Entity("enrollments")
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.enrollments)
  player: Player;

  @ManyToOne(() => Course, (course) => course.enrollments)
  course: Course;

  @Column({ type: "date" })
  enrollment_date: Date;

  @Column({ type: "enum", enum: EnrollmentStatus })
  status: EnrollmentStatus;

  @Column("decimal", { precision: 4, scale: 2, nullable: true })
  grade?: number;

  @OneToOne(() => Payment, (payment) => payment.enrollment, { cascade: true })
  @JoinColumn()
  payment: Payment;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
