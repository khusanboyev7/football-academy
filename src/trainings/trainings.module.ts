import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrainingsService } from "./trainings.service";
import { TrainingsController } from "./trainings.controller";
import { Training } from "./entities/training.entity";
import { Team } from "../teams/entities/team.entity";
import { Coach } from "../coaches/entities/coach.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Training, Team, Coach]), AuthModule],
  controllers: [TrainingsController],
  providers: [TrainingsService],
  exports: [TrainingsService],
})
export class TrainingsModule {}
