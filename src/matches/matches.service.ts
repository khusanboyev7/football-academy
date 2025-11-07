import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Match } from "./entities/match.entity";
import { CreateMatchDto } from "./dto/create-match.dto";
import { UpdateMatchDto } from "./dto/update-match.dto";
import { Team } from "../teams/entities/team.entity";

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>
  ) {}

  async create(dto: CreateMatchDto) {
    try {
      const homeTeam = await this.teamRepository.findOne({
        where: { id: dto.home_teamId },
      });
      const awayTeam = await this.teamRepository.findOne({
        where: { id: dto.away_teamId },
      });

      if (!homeTeam || !awayTeam) {
        throw new NotFoundException("Home yoki Away jamoasi topilmadi");
      }

      const match = this.matchRepository.create({
        date: dto.date,
        location: dto.location,
        home_score: dto.home_score,
        away_score: dto.away_score,
        competition: dto.competition,
        home_team: homeTeam,
        away_team: awayTeam,
      });

      const saved = await this.matchRepository.save(match);
      return {
        success: true,
        message: "Match muvaffaqiyatli yaratildi ✅",
        data: saved,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException({
        success: false,
        message: "Match yaratishda xatolik yuz berdi ❌",
        error: error.message,
      });
    }
  }

  async findAll() {
    try {
      const matches = await this.matchRepository.find({
        relations: ["home_team", "away_team"],
      });
      return {
        success: true,
        message: "Barcha matchlar ro‘yxati",
        data: matches,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: "Matchlarni olishda xatolik yuz berdi",
        error: error.message,
      });
    }
  }

  async findOne(id: number) {
    try {
      const match = await this.matchRepository.findOne({
        where: { id },
        relations: ["home_team", "away_team"],
      });

      if (!match) {
        throw new NotFoundException(`ID ${id} bo‘lgan match topilmadi`);
      }

      return {
        success: true,
        message: "Match topildi",
        data: match,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        success: false,
        message: "Matchni olishda xatolik yuz berdi",
        error: error.message,
      });
    }
  }

  async update(id: number, dto: UpdateMatchDto) {
    try {
      const match = await this.matchRepository.findOne({ where: { id } });
      if (!match)
        throw new NotFoundException(`ID ${id} bo‘lgan match topilmadi`);

      if (dto.home_teamId) {
        const homeTeam = await this.teamRepository.findOne({
          where: { id: dto.home_teamId },
        });
        if (!homeTeam) throw new NotFoundException("Home jamoa topilmadi");
        match.home_team = homeTeam;
      }

      if (dto.away_teamId) {
        const awayTeam = await this.teamRepository.findOne({
          where: { id: dto.away_teamId },
        });
        if (!awayTeam) throw new NotFoundException("Away jamoa topilmadi");
        match.away_team = awayTeam;
      }

      Object.assign(match, dto);

      const updated = await this.matchRepository.save(match);

      return {
        success: true,
        message: "Match muvaffaqiyatli yangilandi ✅",
        data: updated,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException({
        success: false,
        message: "Matchni yangilashda xatolik yuz berdi",
        error: error.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const match = await this.matchRepository.findOne({ where: { id } });
      if (!match)
        throw new NotFoundException(`ID ${id} bo‘lgan match topilmadi`);

      await this.matchRepository.remove(match);
      return {
        success: true,
        message: "Match muvaffaqiyatli o‘chirildi ✅",
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        success: false,
        message: "Matchni o‘chirishda xatolik yuz berdi",
        error: error.message,
      });
    }
  }
}
