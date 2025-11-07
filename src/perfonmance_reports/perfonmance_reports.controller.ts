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
import { PerformanceReportsService } from "./perfonmance_reports.service";
import { CreatePerformanceReportDto } from "./dto/create-perfonmance_report.dto";
import { UpdatePerfonmanceReportDto } from "./dto/update-perfonmance_report.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { PerformanceReport } from "./entities/perfonmance_report.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";

@ApiTags("Performance Reports")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("performance-reports")
export class PerformanceReportsController {
  constructor(
    private readonly performanceReportsService: PerformanceReportsService
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Yangi performance report yaratish" })
  @ApiResponse({
    status: 201,
    description: "Performance report muvaffaqiyatli yaratildi",
    type: PerformanceReport,
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri ma’lumot kiritildi" })
  create(@Body() dto: CreatePerformanceReportDto) {
    return this.performanceReportsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Barcha performance reportlarni olish" })
  @ApiResponse({
    status: 200,
    description: "Performance reportlar ro‘yxati qaytarildi",
    type: [PerformanceReport],
  })
  findAll() {
    return this.performanceReportsService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "ID bo‘yicha performance reportni olish" })
  @ApiResponse({
    status: 200,
    description: "Performance report topildi",
    type: PerformanceReport,
  })
  @ApiNotFoundResponse({
    description: "Berilgan ID bo‘yicha performance report topilmadi",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.performanceReportsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Performance report ma’lumotlarini yangilash" })
  @ApiResponse({
    status: 200,
    description: "Performance report muvaffaqiyatli yangilandi",
    type: PerformanceReport,
  })
  @ApiNotFoundResponse({ description: "Performance report topilmadi" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePerfonmanceReportDto
  ) {
    return this.performanceReportsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Performance reportni o‘chirish" })
  @ApiResponse({
    status: 200,
    description: "Performance report muvaffaqiyatli o‘chirildi",
    type: PerformanceReport,
  })
  @ApiNotFoundResponse({ description: "Performance report topilmadi" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.performanceReportsService.remove(id);
  }
}
