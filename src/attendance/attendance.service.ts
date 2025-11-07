import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Attendance } from "./entities/attendance.entity";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { Player } from "../players/entities/player.entity";
import { Training } from "../trainings/entities/training.entity";

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,

    @InjectRepository(Player)
    private playerRepo: Repository<Player>,

    @InjectRepository(Training)
    private trainingRepo: Repository<Training>
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    try {
      const player = await this.playerRepo.findOne({
        where: { id: createAttendanceDto.playerId },
      });
      const training = await this.trainingRepo.findOne({
        where: { id: createAttendanceDto.trainingId },
      });

      if (!player)
        throw new NotFoundException("Player with given ID not found");
      if (!training)
        throw new NotFoundException("Training with given ID not found");

      const attendance = this.attendanceRepo.create({
        player,
        training,
        attended: createAttendanceDto.attended,
        reason: createAttendanceDto.reason,
      });

      return await this.attendanceRepo.save(attendance);
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed to create attendance"
      );
    }
  }

  async findAll() {
    try {
      return await this.attendanceRepo.find({
        relations: ["player", "training"],
      });
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch attendance list");
    }
  }

  async findOne(id: number) {
    try {
      const attendance = await this.attendanceRepo.findOne({
        where: { id },
        relations: ["player", "training"],
      });
      if (!attendance)
        throw new NotFoundException(`Attendance #${id} not found`);
      return attendance;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    try {
      const attendance = await this.attendanceRepo.findOne({ where: { id } });
      if (!attendance)
        throw new NotFoundException(`Attendance #${id} not found`);

      Object.assign(attendance, updateAttendanceDto);
      return await this.attendanceRepo.save(attendance);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const attendance = await this.attendanceRepo.findOne({ where: { id } });
      if (!attendance)
        throw new NotFoundException(`Attendance #${id} not found`);

      await this.attendanceRepo.remove(attendance);
      return { message: `Attendance #${id} successfully deleted` };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
