import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Course } from "./entities/course.entity";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Coach } from "../coaches/entities/coach.entity";

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(Coach)
    private readonly coachRepo: Repository<Coach>
  ) {}

  async create(dto: CreateCourseDto) {
    try {
      const coach = await this.coachRepo.findOne({
        where: { id: dto.coachId },
      });
      if (!coach)
        throw new NotFoundException(`Coach with ID ${dto.coachId} not found`);

      const newCourse = this.courseRepo.create({
        title: dto.title,
        description: dto.description,
        duration_hours: dto.duration_hours,
        start_date: dto.start_date,
        end_date: dto.end_date,
        price: dto.price,
        coach,
      });

      return await this.courseRepo.save(newCourse);
    } catch (error) {
      throw new BadRequestException(error.message || "Failed to create course");
    }
  }

  async findAll() {
    try {
      return await this.courseRepo.find({
        relations: ["coach", "enrollments"],
        order: { created_at: "DESC" },
      });
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch courses");
    }
  }

  async findOne(id: number) {
    try {
      const course = await this.courseRepo.findOne({
        where: { id },
        relations: ["coach", "enrollments"],
      });

      if (!course) throw new NotFoundException(`Course #${id} not found`);
      return course;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, dto: UpdateCourseDto) {
    try {
      const course = await this.courseRepo.findOne({ where: { id } });
      if (!course) throw new NotFoundException(`Course #${id} not found`);

      if (dto.coachId) {
        const coach = await this.coachRepo.findOne({
          where: { id: dto.coachId },
        });
        if (!coach)
          throw new NotFoundException(`Coach with ID ${dto.coachId} not found`);
        course.coach = coach;
      }

      Object.assign(course, dto);
      return await this.courseRepo.save(course);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const course = await this.courseRepo.findOne({ where: { id } });
      if (!course) throw new NotFoundException(`Course #${id} not found`);

      await this.courseRepo.remove(course);
      return { message: `Course #${id} successfully deleted` };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
