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
import { Coach } from "../../coaches/entities/coach.entity";
import { Attendance } from "../../attendance/entities/attendance.entity";

@Entity("trainings")
export class Training {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, (team) => team.trainings, { onDelete: "CASCADE" })
  team: Team;

  @ManyToOne(() => Coach, (coach) => coach.trainings, { onDelete: "CASCADE" })
  coach: Coach;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "time" })
  start_time: string;

  @Column({ type: "time" })
  end_time: string;

  @Column()
  focus_area: string;

  @OneToMany(() => Attendance, (att) => att.training)
  attendance: Attendance[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
