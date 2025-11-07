import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MatchesService } from "./matches.service";
import { MatchesController } from "./matches.controller";
import { Match } from "./entities/match.entity";
import { Team } from "../teams/entities/team.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Match, Team]), AuthModule],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
