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
import { User } from "../../users/entities/user.entity";
import { PlayerStatistic } from "../../player_statistics/entities/player_statistic.entity";
import { PerformanceReport } from "../../perfonmance_reports/entities/perfonmance_report.entity";
import { MedicalRecord } from "../../medical_records/entities/medical_record.entity";
import { Enrollment } from "../../enrollments/entities/enrollment.entity";
import { Payment } from "../../payments/entities/payment.entity";
import { Attendance } from "../../attendance/entities/attendance.entity";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export enum PlayerPosition {
  GOALKEEPER = "goalkeeper",
  DEFENDER = "defender",
  MIDFIELDER = "midfielder",
  FORWARD = "forward",
}

@Entity("players")
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ type: "date" })
  birth_date: Date;

  @Column()
  nationality: string;

  @Column({ type: "enum", enum: Gender })
  gender: Gender;

  @Column({ type: "enum", enum: PlayerPosition })
  position: PlayerPosition;

  @Column("decimal", { precision: 5, scale: 2 })
  height_cm: number;

  @Column("decimal", { precision: 5, scale: 2 })
  weight_kg: number;

  @Column({ type: "date" })
  joined_date: Date;

  @Column()
  address: string;

  @ManyToOne(() => Team, (team) => team.players, { onDelete: "SET NULL" })
  team: Team;

  @ManyToOne(() => User, (user) => user.players, { onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => PlayerStatistic, (stat) => stat.player)
  statistics: PlayerStatistic[];

  @OneToMany(() => PerformanceReport, (report) => report.player)
  performance_reports: PerformanceReport[];

  @OneToMany(() => MedicalRecord, (record) => record.player)
  medical_records: MedicalRecord[];

  @OneToMany(() => Enrollment, (enroll) => enroll.player)
  enrollments: Enrollment[];

  @OneToMany(() => Payment, (payment) => payment.player)
  payments: Payment[];

  @OneToMany(() => Attendance, (att) => att.player)
  attendance: Attendance[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
