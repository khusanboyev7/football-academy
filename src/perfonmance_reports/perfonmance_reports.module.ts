import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PerformanceReport } from "./entities/perfonmance_report.entity";
import { Player } from "../players/entities/player.entity";
import { Coach } from "../coaches/entities/coach.entity";
import { PerformanceReportsService } from "./perfonmance_reports.service";
import { PerformanceReportsController } from "./perfonmance_reports.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PerformanceReport, Player, Coach]),
    AuthModule,
  ],
  providers: [PerformanceReportsService],
  controllers: [PerformanceReportsController],
  exports: [PerformanceReportsService],
})
export class PerformanceReportsModule {}
