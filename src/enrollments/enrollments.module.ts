import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnrollmentsService } from "./enrollments.service";
import { EnrollmentsController } from "./enrollments.controller";
import { Enrollment } from "./entities/enrollment.entity";
import { Player } from "../players/entities/player.entity";
import { Course } from "../courses/entities/course.entity";
import { Payment } from "../payments/entities/payment.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, Player, Course, Payment]),
    AuthModule,
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
