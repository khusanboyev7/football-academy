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
    const team = await this.teamRepo.findOne({ where: { id: dto.team } });
    if (!team)
      throw new BadRequestException(`Team with ID ${dto.team} does not exist`);

    const user = await this.userRepo.findOne({ where: { id: dto.user } });
    if (!user)
      throw new BadRequestException(`User with ID ${dto.user} does not exist`);

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
    const player = await this.playerRepo.findOne({
      where: { id },
      relations: ["team", "user"],
    });
    if (!player) throw new NotFoundException(`Player with ID ${id} not found`);

    if (dto.team) {
      const team = await this.teamRepo.findOne({ where: { id: dto.team } });
      if (!team)
        throw new BadRequestException(
          `Team with ID ${dto.team} does not exist`
        );
      player.team = team;
    }

    if (dto.user) {
      const user = await this.userRepo.findOne({ where: { id: dto.user } });
      if (!user)
        throw new BadRequestException(
          `User with ID ${dto.user} does not exist`
        );
      player.user = user;
    }

    if (dto.first_name !== undefined) player.first_name = dto.first_name;
    if (dto.last_name !== undefined) player.last_name = dto.last_name;
    if (dto.birth_date !== undefined)
      player.birth_date = new Date(dto.birth_date);
    if (dto.nationality !== undefined) player.nationality = dto.nationality;
    if (dto.gender !== undefined) player.gender = dto.gender;
    if (dto.position !== undefined) player.position = dto.position;
    if (dto.height_cm !== undefined) player.height_cm = dto.height_cm;
    if (dto.weight_kg !== undefined) player.weight_kg = dto.weight_kg;
    if (dto.joined_date !== undefined)
      player.joined_date = new Date(dto.joined_date);
    if (dto.address !== undefined) player.address = dto.address;

    return this.playerRepo.save(player);
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    return this.playerRepo.remove(player);
  }
}
