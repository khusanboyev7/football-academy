import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { Payment } from "./entities/payment.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";

@ApiTags("Payments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Yangi payment yaratish" })
  @ApiResponse({
    status: 201,
    description: "Payment muvaffaqiyatli yaratildi",
    type: Payment,
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri ma’lumot kiritildi" })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Barcha paymentlarni olish" })
  @ApiResponse({
    status: 200,
    description: "Paymentlar ro‘yxati qaytarildi",
    type: [Payment],
  })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "ID bo‘yicha bitta paymentni olish" })
  @ApiResponse({ status: 200, description: "Payment topildi", type: Payment })
  @ApiNotFoundResponse({
    description: "Berilgan ID bo‘yicha payment topilmadi",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Payment ma’lumotlarini yangilash" })
  @ApiResponse({
    status: 200,
    description: "Payment muvaffaqiyatli yangilandi",
    type: Payment,
  })
  @ApiNotFoundResponse({ description: "Payment topilmadi" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Paymentni o‘chirish" })
  @ApiResponse({
    status: 200,
    description: "Payment muvaffaqiyatli o‘chirildi",
    type: Payment,
  })
  @ApiNotFoundResponse({ description: "Payment topilmadi" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.paymentsService.remove(id);
  }
}
