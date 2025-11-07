import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoachesService } from "./coaches.service";
import { CoachesController } from "./coaches.controller";
import { Coach } from "./entities/coach.entity";
import { User } from "../users/entities/user.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Coach, User]), AuthModule],
  controllers: [CoachesController],
  providers: [CoachesService],
  exports: [CoachesService],
})
export class CoachesModule {}
