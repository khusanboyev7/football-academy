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
import { MedicalRecordsService } from "./medical_records.service";
import { CreateMedicalRecordDto } from "./dto/create-medical_record.dto";
import { UpdateMedicalRecordDto } from "./dto/update-medical_record.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { MedicalRecord } from "./entities/medical_record.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";

@ApiTags("Medical Records")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("medical-records")
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Yangi medical record yaratish" })
  @ApiResponse({
    status: 201,
    description: "Medical record muvaffaqiyatli yaratildi",
    type: MedicalRecord,
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri ma’lumot kiritildi" })
  create(@Body() dto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Barcha medical recordlarni olish" })
  @ApiResponse({
    status: 200,
    description: "Medical recordlar ro‘yxati qaytarildi",
    type: [MedicalRecord],
  })
  findAll() {
    return this.medicalRecordsService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "ID bo‘yicha bitta medical recordni olish" })
  @ApiResponse({
    status: 200,
    description: "Medical record topildi",
    type: MedicalRecord,
  })
  @ApiNotFoundResponse({
    description: "Berilgan ID bo‘yicha medical record topilmadi",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.medicalRecordsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Medical recordni yangilash" })
  @ApiResponse({
    status: 200,
    description: "Medical record muvaffaqiyatli yangilandi",
    type: MedicalRecord,
  })
  @ApiNotFoundResponse({ description: "Medical record topilmadi" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateMedicalRecordDto
  ) {
    return this.medicalRecordsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Medical recordni o‘chirish" })
  @ApiResponse({
    status: 200,
    description: "Medical record muvaffaqiyatli o‘chirildi",
    type: MedicalRecord,
  })
  @ApiNotFoundResponse({ description: "Medical record topilmadi" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.medicalRecordsService.remove(id);
  }
}
