import {
  Injectable,
  NotFoundException,
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

  // CREATE
  async create(dto: CreateEnrollmentDto) {
    try {
      const player = await this.playerRepo.findOne({
        where: { id: dto.playerId },
      });
      if (!player)
        throw new NotFoundException(`Player with id ${dto.playerId} not found`);

      const course = await this.courseRepo.findOne({
        where: { id: dto.courseId },
      });
      if (!course)
        throw new NotFoundException(`Course with id ${dto.courseId} not found`);

      const enrollment = this.enrollmentRepo.create({
        player,
        course,
        enrollment_date: new Date(dto.enrollment_date),
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
      throw new InternalServerErrorException({
        success: false,
        message: "Failed to create enrollment",
        error: error.message || error,
      });
    }
  }

  // FIND ALL
  async findAll() {
    try {
      const enrollments = await this.enrollmentRepo.find({
        relations: ["player", "course", "payment"],
        order: { created_at: "DESC" },
      });

      return {
        success: true,
        count: enrollments.length,
        data: enrollments,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: "Failed to fetch enrollments",
        error: error.message || error,
      });
    }
  }

  // FIND ONE
  async findOne(id: number) {
    try {
      const enrollment = await this.enrollmentRepo.findOne({
        where: { id },
        relations: ["player", "course", "payment"],
      });
      if (!enrollment)
        throw new NotFoundException(`Enrollment with id ${id} not found`);

      return { success: true, data: enrollment };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: "Failed to fetch enrollment",
        error: error.message || error,
      });
    }
  }

  // UPDATE
  async update(id: number, dto: UpdateEnrollmentDto) {
    try {
      const enrollment = await this.enrollmentRepo.findOne({
        where: { id },
        relations: ["player", "course"],
      });
      if (!enrollment)
        throw new NotFoundException(`Enrollment with id ${id} not found`);

      if (dto.playerId) {
        const player = await this.playerRepo.findOne({
          where: { id: dto.playerId },
        });
        if (!player)
          throw new NotFoundException(
            `Player with id ${dto.playerId} not found`
          );
        enrollment.player = player;
      }

      if (dto.courseId) {
        const course = await this.courseRepo.findOne({
          where: { id: dto.courseId },
        });
        if (!course)
          throw new NotFoundException(
            `Course with id ${dto.courseId} not found`
          );
        enrollment.course = course;
      }

      if (dto.enrollment_date)
        enrollment.enrollment_date = new Date(dto.enrollment_date);
      if (dto.status) enrollment.status = dto.status;
      if (dto.grade !== undefined) enrollment.grade = dto.grade;

      const updated = await this.enrollmentRepo.save(enrollment);

      return {
        success: true,
        message: "Enrollment updated successfully",
        data: updated,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: "Failed to update enrollment",
        error: error.message || error,
      });
    }
  }

  // DELETE
  async remove(id: number) {
    try {
      const enrollment = await this.enrollmentRepo.findOne({ where: { id } });
      if (!enrollment)
        throw new NotFoundException(`Enrollment with id ${id} not found`);

      await this.enrollmentRepo.remove(enrollment);

      return {
        success: true,
        message: `Enrollment with id ${id} deleted successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: "Failed to delete enrollment",
        error: error.message || error,
      });
    }
  }
}
