import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Coach } from "./entities/coach.entity";
import { CreateCoachDto } from "./dto/create-coach.dto";
import { UpdateCoachDto } from "./dto/update-coach.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class CoachesService {
  constructor(
    @InjectRepository(Coach)
    private coachRepo: Repository<Coach>,

    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async create(dto: CreateCoachDto) {
    try {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException("User with given ID not found");

      const newCoach = this.coachRepo.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        licenseLevel: dto.licenseLevel,
        specialty: dto.specialty,
        user,
      });

      return await this.coachRepo.save(newCoach);
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed to create new coach"
      );
    }
  }

  async findAll() {
    try {
      return await this.coachRepo.find({
        relations: [
          "user",
          "teams",
          "courses",
          "trainings",
          "performanceReports",
        ],
      });
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch coach list");
    }
  }

  async findOne(id: number) {
    try {
      const coach = await this.coachRepo.findOne({
        where: { id },
        relations: [
          "user",
          "teams",
          "courses",
          "trainings",
          "performanceReports",
        ],
      });
      if (!coach) throw new NotFoundException(`Coach #${id} not found`);
      return coach;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, dto: UpdateCoachDto) {
    try {
      const coach = await this.coachRepo.findOne({ where: { id } });
      if (!coach) throw new NotFoundException(`Coach #${id} not found`);

      Object.assign(coach, dto);
      return await this.coachRepo.save(coach);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const coach = await this.coachRepo.findOne({ where: { id } });
      if (!coach) throw new NotFoundException(`Coach #${id} not found`);

      await this.coachRepo.remove(coach);
      return { message: `Coach #${id} successfully deleted` };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
