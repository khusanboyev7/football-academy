import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Team } from "../../teams/entities/team.entity";
import { Course } from "../../courses/entities/course.entity";
import { Training } from "../../trainings/entities/training.entity";
import { PerformanceReport } from "../../perfonmance_reports/entities/perfonmance_report.entity";

export enum LicenceLevel {
  UEFA_A = "UEFA A",
  UEFA_B = "UEFA B",
  UEFA_C = "UEFA C",
  LOCAL = "Local",
}

@Entity("coaches")
export class Coach {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: "enum", enum: LicenceLevel })
  licenseLevel: LicenceLevel;

  @Column()
  specialty: string;

  @ManyToOne(() => User, (user) => user.coaches, { onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => Team, (team) => team.coach)
  teams: Team[];

  @OneToMany(() => Course, (course) => course.coach)
  courses: Course[];

  @OneToMany(() => Training, (training) => training.coach)
  trainings: Training[];

  @OneToMany(() => PerformanceReport, (report) => report.coach)
  performanceReports: PerformanceReport[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
