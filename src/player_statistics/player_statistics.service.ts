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

@Injectable()
export class PlayerStatisticsService {
  constructor(
    @InjectRepository(PlayerStatistic)
    private readonly playerStatisticRepo: Repository<PlayerStatistic>
  ) {}

  async create(dto: CreatePlayerStatisticDto) {
    try {
      const statistic = this.playerStatisticRepo.create(dto);
      return await this.playerStatisticRepo.save(statistic);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
    const statistic = await this.playerStatisticRepo.preload({ id, ...dto });
    if (!statistic)
      throw new NotFoundException(`PlayerStatistic with ID ${id} not found`);
    return await this.playerStatisticRepo.save(statistic);
  }

  async remove(id: number) {
    const statistic = await this.findOne(id);
    return await this.playerStatisticRepo.remove(statistic);
  }
}
