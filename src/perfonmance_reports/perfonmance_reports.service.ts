import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PerformanceReport } from "./entities/perfonmance_report.entity";
import { CreatePerformanceReportDto } from "./dto/create-perfonmance_report.dto";
import { UpdatePerfonmanceReportDto } from "./dto/update-perfonmance_report.dto";
import { Player } from "../players/entities/player.entity";
import { Coach } from "../coaches/entities/coach.entity";

@Injectable()
export class PerformanceReportsService {
  constructor(
    @InjectRepository(PerformanceReport)
    private readonly performanceReportRepo: Repository<PerformanceReport>,
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
    @InjectRepository(Coach)
    private readonly coachRepo: Repository<Coach>
  ) {}

  async create(dto: CreatePerformanceReportDto) {
    try {
      const player = await this.playerRepo.findOne({
        where: { id: dto.playerId },
      });
      if (!player) return { error: `Player with id ${dto.playerId} not found` };

      const coach = await this.coachRepo.findOne({
        where: { id: dto.coachId },
      });
      if (!coach) return { error: `Coach with id ${dto.coachId} not found` };

      const report = this.performanceReportRepo.create({
        player,
        coach,
        report_date: new Date(dto.report_date),
        strengths: dto.strengths,
        weaknesses: dto.weaknesses,
        recommendations: dto.recommendations,
        overall_score: dto.overall_score,
      });
      await this.performanceReportRepo.save(report);
      return report;
    } catch (error) {
      return {
        error: "Failed to create performance report",
        details: error.message,
      };
    }
  }

  async findAll() {
    try {
      return await this.performanceReportRepo.find({
        relations: ["player", "coach"],
      });
    } catch (error) {
      return {
        error: "Failed to fetch performance reports",
        details: error.message,
      };
    }
  }

  async findOne(id: number) {
    try {
      const report = await this.performanceReportRepo.findOne({
        where: { id },
        relations: ["player", "coach"],
      });
      if (!report)
        return { error: `Performance report with id ${id} not found` };
      return report;
    } catch (error) {
      return {
        error: "Failed to fetch performance report",
        details: error.message,
      };
    }
  }

  async update(id: number, dto: UpdatePerfonmanceReportDto) {
    const report = await this.performanceReportRepo.findOne({
      where: { id },
      relations: ["player", "coach"],
    });
    if (!report)
      throw new NotFoundException(`Performance report with id ${id} not found`);

    if (dto.playerId) {
      const player = await this.playerRepo.findOne({
        where: { id: dto.playerId },
      });
      if (!player)
        throw new NotFoundException(`Player with id ${dto.playerId} not found`);
      report.player = player;
    }

    if (dto.coachId) {
      const coach = await this.coachRepo.findOne({
        where: { id: dto.coachId },
      });
      if (!coach)
        throw new NotFoundException(`Coach with id ${dto.coachId} not found`);
      report.coach = coach;
    }

    if (dto.report_date) report.report_date = new Date(dto.report_date);
    if (dto.strengths) report.strengths = dto.strengths;
    if (dto.weaknesses) report.weaknesses = dto.weaknesses;
    if (dto.recommendations) report.recommendations = dto.recommendations;
    if (dto.overall_score !== undefined)
      report.overall_score = dto.overall_score;

    return this.performanceReportRepo.save(report);
  }

  async remove(id: number) {
    try {
      const report = await this.performanceReportRepo.findOne({
        where: { id },
      });
      if (!report)
        return { error: `Performance report with id ${id} not found` };

      await this.performanceReportRepo.remove(report);
      return {
        message: `Performance report with id ${id} deleted successfully`,
      };
    } catch (error) {
      return {
        error: "Failed to delete performance report",
        details: error.message,
      };
    }
  }
}
