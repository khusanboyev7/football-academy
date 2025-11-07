import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod, PaymentStatus } from "../entities/payment.entity";

export class CreatePaymentDto {
  @ApiProperty({ example: 1 })
  playerId: number;

  @ApiProperty({ example: 2 })
  enrollmentId: number;

  @ApiProperty({ example: 120.5 })
  amount: number;

  @ApiProperty({ type: "string", format: "date" })
  payment_date: Date;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CARD })
  payment_method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.PAID })
  status: PaymentStatus;
}
