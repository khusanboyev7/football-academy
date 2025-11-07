import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Training } from "./entities/training.entity";
import { CreateTrainingDto } from "./dto/create-training.dto";
import { UpdateTrainingDto } from "./dto/update-training.dto";
import { Team } from "../teams/entities/team.entity";
import { Coach } from "../coaches/entities/coach.entity";

@Injectable()
export class TrainingsService {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepo: Repository<Training>,
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
    @InjectRepository(Coach)
    private readonly coachRepo: Repository<Coach>
  ) {}

  async create(dto: CreateTrainingDto) {
    const team = await this.teamRepo.findOne({ where: { id: dto.teamId } });
    if (!team)
      throw new BadRequestException(
        `Team with ID ${dto.teamId} does not exist`
      );

    const coach = await this.coachRepo.findOne({ where: { id: dto.coachId } });
    if (!coach)
      throw new BadRequestException(
        `Coach with ID ${dto.coachId} does not exist`
      );

    const training = this.trainingRepo.create({ ...dto, team, coach });
    return this.trainingRepo.save(training);
  }

  findAll() {
    return this.trainingRepo.find({
      relations: ["team", "coach", "attendance"],
    });
  }

  async findOne(id: number) {
    const training = await this.trainingRepo.findOne({
      where: { id },
      relations: ["team", "coach", "attendance"],
    });
    if (!training)
      throw new NotFoundException(`Training with ID ${id} not found`);
    return training;
  }

  async update(id: number, dto: UpdateTrainingDto) {
    const training = await this.trainingRepo.preload({ id, ...dto });
    if (!training)
      throw new NotFoundException(`Training with ID ${id} not found`);

    // Agar teamId berilgan bo'lsa tekshirish
    if (dto.teamId) {
      const team = await this.teamRepo.findOne({ where: { id: dto.teamId } });
      if (!team)
        throw new BadRequestException(
          `Team with ID ${dto.teamId} does not exist`
        );
      training.team = team;
    }

    // Agar coachId berilgan bo'lsa tekshirish
    if (dto.coachId) {
      const coach = await this.coachRepo.findOne({
        where: { id: dto.coachId },
      });
      if (!coach)
        throw new BadRequestException(
          `Coach with ID ${dto.coachId} does not exist`
        );
      training.coach = coach;
    }

    return this.trainingRepo.save(training);
  }

  async remove(id: number) {
    const training = await this.findOne(id);
    return this.trainingRepo.remove(training);
  }
}
