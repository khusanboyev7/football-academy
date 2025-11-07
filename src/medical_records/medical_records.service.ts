import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MedicalRecord } from "./entities/medical_record.entity";
import { CreateMedicalRecordDto } from "./dto/create-medical_record.dto";
import { UpdateMedicalRecordDto } from "./dto/update-medical_record.dto";

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepo: Repository<MedicalRecord>
  ) {}

  async create(dto: CreateMedicalRecordDto) {
    try {
      const record = this.medicalRecordRepo.create({
        ...dto,
        player: { id: dto.playerId },
      });
      await this.medicalRecordRepo.save(record);
      return {
        success: true,
        data: record,
        message: "Medical record created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || error,
        message: "Failed to create medical record",
      };
    }
  }

  async findAll() {
    try {
      const records = await this.medicalRecordRepo.find({
        relations: ["player"],
      });
      return { success: true, data: records };
    } catch (error) {
      return {
        success: false,
        error: error.message || error,
        message: "Failed to fetch medical records",
      };
    }
  }

  async findOne(id: number) {
    try {
      const record = await this.medicalRecordRepo.findOne({
        where: { id },
        relations: ["player"],
      });
      if (!record)
        return {
          success: false,
          message: `Medical record with id ${id} not found`,
        };
      return { success: true, data: record };
    } catch (error) {
      return {
        success: false,
        error: error.message || error,
        message: `Failed to fetch medical record with id ${id}`,
      };
    }
  }

  async update(id: number, dto: UpdateMedicalRecordDto) {
    try {
      const record = await this.medicalRecordRepo.preload({
        id,
        ...dto,
        player: dto.playerId ? { id: dto.playerId } : undefined,
      });
      if (!record)
        return {
          success: false,
          message: `Medical record with id ${id} not found`,
        };
      await this.medicalRecordRepo.save(record);
      return {
        success: true,
        data: record,
        message: "Medical record updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || error,
        message: `Failed to update medical record with id ${id}`,
      };
    }
  }

  async remove(id: number) {
    try {
      const record = await this.medicalRecordRepo.findOne({ where: { id } });
      if (!record)
        return {
          success: false,
          message: `Medical record with id ${id} not found`,
        };
      await this.medicalRecordRepo.remove(record);
      return { success: true, message: "Medical record removed successfully" };
    } catch (error) {
      return {
        success: false,
        error: error.message || error,
        message: `Failed to remove medical record with id ${id}`,
      };
    }
  }
}
