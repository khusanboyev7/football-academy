import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayersService } from "./players.service";
import { PlayersController } from "./players.controller";
import { Player } from "./entities/player.entity";
import { Team } from "../teams/entities/team.entity";
import { User } from "../users/entities/user.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Player, Team, User]), AuthModule],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
