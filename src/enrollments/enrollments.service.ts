import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Enrollment, EnrollmentStatus } from "./entities/enrollment.entity";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { UpdateEnrollmentDto } from "./dto/update-enrollment.dto";
import { Player } from "../players/entities/player.entity";
import { Course } from "../courses/entities/course.entity";

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>
  ) {}

  async create(dto: CreateEnrollmentDto) {
    try {
      const player = await this.playerRepo.findOne({
        where: { id: dto.playerId },
      });
      if (!player)
        throw new NotFoundException({
          message: `Player with id ${dto.playerId} not found`,
        });

      const course = await this.courseRepo.findOne({
        where: { id: dto.courseId },
      });
      if (!course)
        throw new NotFoundException({
          message: `Course with id ${dto.courseId} not found`,
        });

      const enrollment = this.enrollmentRepo.create({
        player,
        course,
        enrollment_date: dto.enrollment_date,
        status: dto.status || EnrollmentStatus.ACTIVE,
        grade: dto.grade,
      });

      const saved = await this.enrollmentRepo.save(enrollment);

      return {
        success: true,
        message: "Enrollment successfully created",
        data: saved,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new InternalServerErrorException({
        success: false,
        message: "Failed to create enrollment",
        error: error.message,
      });
    }
  }

  async findAll() {
    try {
      const data = await this.enrollmentRepo.find({
        relations: ["player", "course", "payment"],
      });

      return {
        success: true,
        count: data.length,
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: "Error fetching enrollments",
        error: error.message,
      });
    }
  }

  async findOne(id: number) {
    try {
      const enrollment = await this.enrollmentRepo.findOne({
        where: { id },
        relations: ["player", "course", "payment"],
      });
      if (!enrollment)
        throw new NotFoundException({
          success: false,
          message: `Enrollment with id ${id} not found`,
        });

      return {
        success: true,
        data: enrollment,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        success: false,
        message: "Error retrieving enrollment",
        error: error.message,
      });
    }
  }

  async update(id: number, dto: UpdateEnrollmentDto) {
    try {
      const enrollment = await this.enrollmentRepo.findOne({ where: { id } });
      if (!enrollment)
        throw new NotFoundException({
          success: false,
          message: `Enrollment with id ${id} not found`,
        });

      Object.assign(enrollment, dto);
      const updated = await this.enrollmentRepo.save(enrollment);

      return {
        success: true,
        message: "Enrollment updated successfully",
        data: updated,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        success: false,
        message: "Error updating enrollment",
        error: error.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const enrollment = await this.enrollmentRepo.findOne({ where: { id } });
      if (!enrollment)
        throw new NotFoundException({
          success: false,
          message: `Enrollment with id ${id} not found`,
        });

      await this.enrollmentRepo.remove(enrollment);

      return {
        success: true,
        message: `Enrollment with id ${id} deleted successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        success: false,
        message: "Error deleting enrollment",
        error: error.message,
      });
    }
  }
}
