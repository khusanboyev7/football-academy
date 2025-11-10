import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Team } from "./entities/team.entity";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { Coach } from "../coaches/entities/coach.entity";

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
    @InjectRepository(Coach)
    private readonly coachRepo: Repository<Coach>
  ) {}

  async create(dto: CreateTeamDto) {
    const coach = await this.coachRepo.findOne({ where: { id: dto.coachId } });
    if (!coach)
      throw new BadRequestException(
        `Coach with ID ${dto.coachId} does not exist`
      );

    const team = this.teamRepo.create({ ...dto, coach });
    return this.teamRepo.save(team);
  }

  findAll() {
    return this.teamRepo.find({
      relations: [
        "coach",
        "players",
        "home_matches",
        "away_matches",
        "trainings",
      ],
    });
  }

  async findOne(id: number) {
    const team = await this.teamRepo.findOne({
      where: { id },
      relations: [
        "coach",
        "players",
        "home_matches",
        "away_matches",
        "trainings",
      ],
    });
    if (!team) throw new NotFoundException(`Team with ID ${id} not found`);
    return team;
  }

  async update(id: number, dto: UpdateTeamDto) {
    const team = await this.teamRepo.preload({ id, ...dto });
    if (!team) throw new NotFoundException(`Team with ID ${id} not found`);

    if (dto.coachId) {
      const coach = await this.coachRepo.findOne({
        where: { id: dto.coachId },
      });
      if (!coach)
        throw new BadRequestException(
          `Coach with ID ${dto.coachId} does not exist`
        );
      team.coach = coach;
    }

    return this.teamRepo.save(team);
  }

  async remove(id: number) {
    const team = await this.findOne(id);
    return this.teamRepo.remove(team);
  }
}
