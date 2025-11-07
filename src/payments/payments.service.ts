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

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>
  ) {}

  async create(dto: CreatePaymentDto) {
    try {
      const payment = this.paymentRepository.create(dto);
      return await this.paymentRepository.save(payment);
    } catch (error) {
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
      const payment = await this.paymentRepository.preload({ id, ...dto });
      if (!payment) throw new NotFoundException("Payment not found");
      return await this.paymentRepository.save(payment);
    } catch (error) {
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
