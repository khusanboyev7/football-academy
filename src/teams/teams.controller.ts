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
import { TeamsService } from "./teams.service";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { Team } from "./entities/team.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";

@ApiTags("Teams")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Yangi team yaratish" })
  @ApiResponse({
    status: 201,
    description: "Team muvaffaqiyatli yaratildi",
    type: Team,
  })
  @ApiBadRequestResponse({
    description: "Coach topilmadi yoki noto‘g‘ri ma’lumot",
  })
  create(@Body() dto: CreateTeamDto) {
    return this.teamsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Barcha teamlarni olish" })
  @ApiResponse({
    status: 200,
    description: "Teamlar ro‘yxati qaytarildi",
    type: [Team],
  })
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "ID bo‘yicha teamni olish" })
  @ApiResponse({ status: 200, description: "Team topildi", type: Team })
  @ApiNotFoundResponse({ description: "Berilgan ID bo‘yicha team topilmadi" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Team ma’lumotlarini yangilash" })
  @ApiResponse({
    status: 200,
    description: "Team muvaffaqiyatli yangilandi",
    type: Team,
  })
  @ApiNotFoundResponse({ description: "Team topilmadi" })
  @ApiBadRequestResponse({
    description: "Coach topilmadi yoki noto‘g‘ri ma’lumot",
  })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateTeamDto) {
    return this.teamsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Teamni o‘chirish" })
  @ApiResponse({
    status: 200,
    description: "Team muvaffaqiyatli o‘chirildi",
    type: Team,
  })
  @ApiNotFoundResponse({ description: "Team topilmadi" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.teamsService.remove(id);
  }
}
