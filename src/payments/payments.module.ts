// payments.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { Payment } from "./entities/payment.entity";
import { AuthModule } from "../auth/auth.module";
import { Enrollment } from "../enrollments/entities/enrollment.entity";
import { Player } from "../players/entities/player.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Enrollment, Player]), AuthModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
