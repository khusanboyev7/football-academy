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

  async create(dto: CreateAttendanceDto) {
    const player = await this.playerRepo.findOne({
      where: { id: dto.playerId },
    });
    const training = await this.trainingRepo.findOne({
      where: { id: dto.trainingId },
    });

    if (!player) throw new NotFoundException("Player not found");
    if (!training) throw new NotFoundException("Training not found");

    const attendance = this.attendanceRepo.create({
      player,
      training,
      attended: dto.attended,
      reason: dto.reason,
    });

    return this.attendanceRepo.save(attendance);
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

  async update(id: number, dto: UpdateAttendanceDto) {
    const attendance = await this.attendanceRepo.findOne({ where: { id } });
    if (!attendance) throw new NotFoundException(`Attendance #${id} not found`);

    if (dto.playerId) {
      const player = await this.playerRepo.findOne({
        where: { id: dto.playerId },
      });
      if (!player) throw new NotFoundException("Player not found");
      attendance.player = player;
    }

    if (dto.trainingId) {
      const training = await this.trainingRepo.findOne({
        where: { id: dto.trainingId },
      });
      if (!training) throw new NotFoundException("Training not found");
      attendance.training = training;
    }

    Object.assign(attendance, dto);
    return this.attendanceRepo.save(attendance);
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
