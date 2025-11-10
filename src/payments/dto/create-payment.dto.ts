import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod, PaymentStatus } from "../entities/payment.entity";
import { IsEnum, IsNumber, IsDateString } from "class-validator";

export class CreatePaymentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  playerId: number; 

  @ApiProperty({ example: 2 })
  @IsNumber()
  enrollmentId: number;

  @ApiProperty({ example: 120.5 })
  @IsNumber()
  amount: number;

  @ApiProperty({ type: "string", format: "date" })
  @IsDateString()
  payment_date: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CARD })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.PAID })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
