import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoursesService } from "./courses.service";
import { CoursesController } from "./courses.controller";
import { Course } from "./entities/course.entity";
import { Coach } from "../coaches/entities/coach.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Course, Coach]), AuthModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
