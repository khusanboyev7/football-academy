import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AttendanceService } from "./attendance.service";
import { AttendanceController } from "./attendance.controller";
import { Attendance } from "./entities/attendance.entity";
import { Player } from "../players/entities/player.entity";
import { Training } from "../trainings/entities/training.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, Player, Training]),
    AuthModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
