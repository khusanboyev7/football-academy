import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayerStatisticsService } from "./player_statistics.service";
import { PlayerStatisticsController } from "./player_statistics.controller";
import { PlayerStatistic } from "./entities/player_statistic.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([PlayerStatistic]), AuthModule],
  controllers: [PlayerStatisticsController],
  providers: [PlayerStatisticsService],
  exports: [PlayerStatisticsService],
})
export class PlayerStatisticsModule {}
