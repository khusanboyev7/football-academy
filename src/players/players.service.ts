import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Player } from "./entities/player.entity";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { Team } from "../teams/entities/team.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async create(dto: CreatePlayerDto) {
    // Team va User mavjudligini tekshirish
    const team = await this.teamRepo.findOne({ where: { id: dto.teamId } });
    if (!team)
      throw new BadRequestException(
        `Team with ID ${dto.teamId} does not exist`
      );

    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user)
      throw new BadRequestException(
        `User with ID ${dto.userId} does not exist`
      );

    const player = this.playerRepo.create({ ...dto, team, user });
    return this.playerRepo.save(player);
  }

  findAll() {
    return this.playerRepo.find({
      relations: [
        "team",
        "user",
        "statistics",
        "performance_reports",
        "medical_records",
        "enrollments",
        "payments",
        "attendance",
      ],
    });
  }

  async findOne(id: number) {
    const player = await this.playerRepo.findOne({
      where: { id },
      relations: [
        "team",
        "user",
        "statistics",
        "performance_reports",
        "medical_records",
        "enrollments",
        "payments",
        "attendance",
      ],
    });
    if (!player) throw new NotFoundException(`Player with ID ${id} not found`);
    return player;
  }

  async update(id: number, dto: UpdatePlayerDto) {
    const player = await this.playerRepo.preload({ id, ...dto });
    if (!player) throw new NotFoundException(`Player with ID ${id} not found`);
    return this.playerRepo.save(player);
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    return this.playerRepo.remove(player);
  }
}
