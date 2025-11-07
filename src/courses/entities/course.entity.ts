import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Coach } from "../../coaches/entities/coach.entity";
import { Enrollment } from "../../enrollments/entities/enrollment.entity";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column("int")
  duration_hours: number;

  @Column({ type: "date" })
  start_date: Date;

  @Column({ type: "date" })
  end_date: Date;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Coach, (coach) => coach.courses, { onDelete: "SET NULL" })
  coach: Coach;

  @OneToMany(() => Enrollment, (enroll) => enroll.course)
  enrollments: Enrollment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
