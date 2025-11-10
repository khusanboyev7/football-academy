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
import { TrainingsService } from "./trainings.service";
import { CreateTrainingDto } from "./dto/create-training.dto";
import { UpdateTrainingDto } from "./dto/update-training.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { Training } from "./entities/training.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/";
import { Roles } from "../common/decorators";
import { Role } from "../common/enum/role.enum";

@ApiTags("Trainings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("trainings")
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Yangi trening sessiyasi yaratish" })
  @ApiResponse({
    status: 201,
    description: "Training muvaffaqiyatli yaratildi",
    type: Training,
  })
  @ApiBadRequestResponse({
    description: "Team yoki Coach topilmadi yoki noto‘g‘ri ma’lumot",
  })
  create(@Body() dto: CreateTrainingDto) {
    return this.trainingsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Barcha trening sessiyalarini olish" })
  @ApiResponse({
    status: 200,
    description: "Treninglar ro‘yxati qaytarildi",
    type: [Training],
  })
  findAll() {
    return this.trainingsService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "ID bo‘yicha trening sessiyasini olish" })
  @ApiResponse({ status: 200, description: "Trening topildi", type: Training })
  @ApiNotFoundResponse({
    description: "Berilgan ID bo‘yicha trening topilmadi",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.trainingsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Trening sessiyasini yangilash" })
  @ApiResponse({
    status: 200,
    description: "Trening muvaffaqiyatli yangilandi",
    type: Training,
  })
  @ApiNotFoundResponse({ description: "Trening topilmadi" })
  @ApiBadRequestResponse({
    description: "Team yoki Coach topilmadi yoki noto‘g‘ri ma’lumot",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTrainingDto
  ) {
    return this.trainingsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Trening sessiyasini o‘chirish" })
  @ApiResponse({
    status: 200,
    description: "Trening muvaffaqiyatli o‘chirildi",
    type: Training,
  })
  @ApiNotFoundResponse({ description: "Trening topilmadi" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.trainingsService.remove(id);
  }
}
