// payments.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "./entities/payment.entity";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { Player } from "../players/entities/player.entity";
import { Enrollment } from "../enrollments/entities/enrollment.entity";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>
  ) {}

  async create(dto: CreatePaymentDto) {
    try {
      const player = await this.playerRepo.findOne({
        where: { id: dto.playerId },
      });
      if (!player)
        throw new NotFoundException(`Player with id ${dto.playerId} not found`);

      const enrollment = await this.enrollmentRepo.findOne({
        where: { id: dto.enrollmentId },
      });
      if (!enrollment)
        throw new NotFoundException(
          `Enrollment with id ${dto.enrollmentId} not found`
        );

      const payment = this.paymentRepository.create({
        player,
        enrollment,
        amount: dto.amount,
        payment_date: dto.payment_date,
        payment_method: dto.payment_method,
        status: dto.status,
      });

      const saved = await this.paymentRepository.save(payment);
      return {
        success: true,
        message: "Payment created successfully",
        data: saved,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        "Failed to create payment: " + error.message
      );
    }
  }

  async findAll() {
    try {
      return await this.paymentRepository.find({
        relations: ["player", "enrollment"],
      });
    } catch (error) {
      throw new BadRequestException(
        "Failed to fetch payments: " + error.message
      );
    }
  }

  async findOne(id: number) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id },
        relations: ["player", "enrollment"],
      });
      if (!payment) throw new NotFoundException("Payment not found");
      return payment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, dto: UpdatePaymentDto) {
    try {
      let playerObj: Player | null = null;
      let enrollmentObj: Enrollment | null = null;

      if (dto.playerId !== undefined) {
        playerObj = await this.playerRepo.findOne({
          where: { id: dto.playerId },
        });
        if (!playerObj)
          throw new NotFoundException(
            `Player with id ${dto.playerId} not found`
          );
      }

      if (dto.enrollmentId !== undefined) {
        enrollmentObj = await this.enrollmentRepo.findOne({
          where: { id: dto.enrollmentId },
        });
        if (!enrollmentObj)
          throw new NotFoundException(
            `Enrollment with id ${dto.enrollmentId} not found`
          );
      }

      const paymentData: any = { id, ...dto };
      if (playerObj) paymentData.player = playerObj;
      if (enrollmentObj) paymentData.enrollment = enrollmentObj;

      delete paymentData.playerId;
      delete paymentData.enrollmentId;

      const payment = await this.paymentRepository.preload(paymentData);
      if (!payment) throw new NotFoundException("Payment not found");

      const updated = await this.paymentRepository.save(payment);
      return {
        success: true,
        message: "Payment updated successfully",
        data: updated,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const payment = await this.paymentRepository.findOne({ where: { id } });
      if (!payment) throw new NotFoundException("Payment not found");
      await this.paymentRepository.remove(payment);
      return { success: true, message: "Payment deleted successfully" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
