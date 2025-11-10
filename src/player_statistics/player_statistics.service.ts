import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreatePlayerStatisticDto } from "./dto/create-player_statistic.dto";
import { UpdatePlayerStatisticDto } from "./dto/update-player_statistic.dto";
import { Repository } from "typeorm";
import { PlayerStatistic } from "./entities/player_statistic.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Match } from "../matches/entities/match.entity";
import { Player } from "../players/entities/player.entity";

@Injectable()
export class PlayerStatisticsService {
  constructor(
    @InjectRepository(PlayerStatistic)
    private readonly playerStatisticRepo: Repository<PlayerStatistic>,

    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,

    @InjectRepository(Player)
    private readonly palyerRepo: Repository<Player>
  ) {}

  // === CRUD ===

  async create(dto: CreatePlayerStatisticDto) {
    const player = await this.palyerRepo.findOne({
      where: { id: dto.playerId },
    });
    if (!player)
      throw new NotFoundException(`Player with ID ${dto.playerId} not found`);

    const match = await this.matchRepo.findOne({ where: { id: dto.matchId } });
    if (!match)
      throw new NotFoundException(`Match with ID ${dto.matchId} not found`);

    const statistic = this.playerStatisticRepo.create({
      player,
      match,
      goals: dto.goals,
      assists: dto.assists,
      yellow_cards: dto.yellow_cards,
      red_cards: dto.red_cards,
      minutes_played: dto.minutes_played,
      rating: dto.rating,
    });

    return await this.playerStatisticRepo.save(statistic);
  }

  async findAll() {
    return await this.playerStatisticRepo.find({
      relations: ["player", "match"],
    });
  }

  async findOne(id: number) {
    const statistic = await this.playerStatisticRepo.findOne({
      where: { id },
      relations: ["player", "match"],
    });
    if (!statistic)
      throw new NotFoundException(`PlayerStatistic with ID ${id} not found`);
    return statistic;
  }

  async update(id: number, dto: UpdatePlayerStatisticDto) {
    const statistic = await this.playerStatisticRepo.findOne({
      where: { id },
      relations: ["player", "match"],
    });
    if (!statistic)
      throw new NotFoundException(`PlayerStatistic with ID ${id} not found`);

    if (dto.playerId) {
      const player = await this.palyerRepo.findOne({
        where: { id: dto.playerId },
      });
      if (!player)
        throw new NotFoundException(`Player with ID ${dto.playerId} not found`);
      statistic.player = player;
    }

    if (dto.matchId) {
      const match = await this.matchRepo.findOne({
        where: { id: dto.matchId },
      });
      if (!match)
        throw new NotFoundException(`Match with ID ${dto.matchId} not found`);
      statistic.match = match;
    }

    Object.assign(statistic, dto);
    return await this.playerStatisticRepo.save(statistic);
  }

  async remove(id: number) {
    const statistic = await this.findOne(id);
    return await this.playerStatisticRepo.remove(statistic);
  }

  // === 📊 SMART QUERIES ===

  // 1️⃣ Eng yaxshi o‘yinchilar (o‘rtacha reyting bo‘yicha)
  async getTopPlayers(limit = 5) {
    return await this.playerStatisticRepo
      .createQueryBuilder("stat")
      .leftJoin("stat.player", "player")
      .select("player.id", "playerId")
      .addSelect(
        `CONCAT(player.first_name, ' ', player.last_name)`,
        "playerName"
      )
      .addSelect("COALESCE(AVG(stat.rating), 0)", "avgRating")
      .groupBy("player.id")
      .addGroupBy("player.first_name")
      .addGroupBy("player.last_name")
      .orderBy("COALESCE(AVG(stat.rating), 0)", "DESC")
      .limit(limit)
      .getRawMany();
  }

  // 2️⃣ Match bo‘yicha umumiy gol va o‘rtacha reyting
  async getMatchGoals(matchId: number) {
    return await this.playerStatisticRepo
      .createQueryBuilder("stat")
      .leftJoin("stat.match", "match")
      .where("match.id = :matchId", { matchId })
      .select("SUM(stat.goals)", "totalGoals")
      .addSelect("AVG(stat.rating)", "avgRating")
      .getRawOne();
  }

  // 3️⃣ Eng ko‘p kartochka olgan o‘yinchilar
  async getMostCardedPlayers(limit = 5) {
    return await this.playerStatisticRepo
      .createQueryBuilder("stat")
      .leftJoin("stat.player", "player")
      .select("player.id", "playerId")
      .addSelect(
        `CONCAT(player.first_name, ' ', player.last_name)`,
        "playerName"
      )
      .addSelect(
        "COALESCE(SUM(stat.yellow_cards) + SUM(stat.red_cards), 0)",
        "totalCards"
      )
      .groupBy("player.id")
      .addGroupBy("player.first_name")
      .addGroupBy("player.last_name")
      .orderBy(
        "COALESCE(SUM(stat.yellow_cards) + SUM(stat.red_cards), 0)",
        "DESC"
      )
      .limit(limit)
      .getRawMany();
  }
}
