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
  Query,
} from "@nestjs/common";
import { PlayerStatisticsService } from "./player_statistics.service";
import { CreatePlayerStatisticDto } from "./dto/create-player_statistic.dto";
import { UpdatePlayerStatisticDto } from "./dto/update-player_statistic.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { PlayerStatistic } from "./entities/player_statistic.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";

@ApiTags("Player Statistics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("player-statistics")
export class PlayerStatisticsController {
  constructor(
    private readonly playerStatisticsService: PlayerStatisticsService
  ) {}


  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Yangi player statistic yaratish" })
  @ApiResponse({
    status: 201,
    description: "Player statistic muvaffaqiyatli yaratildi",
    type: PlayerStatistic,
  })
  create(@Body() dto: CreatePlayerStatisticDto) {
    return this.playerStatisticsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Barcha player statisticlarni olish" })
  @ApiResponse({
    status: 200,
    description: "Player statisticlar ro‘yxati qaytarildi",
    type: [PlayerStatistic],
  })
  findAll() {
    return this.playerStatisticsService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "ID bo‘yicha player statisticni olish" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.playerStatisticsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Player statistic ma’lumotlarini yangilash" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePlayerStatisticDto
  ) {
    return this.playerStatisticsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Player statisticni o‘chirish" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.playerStatisticsService.remove(id);
  }

  @Get("analytics/top-players")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH)
  @ApiOperation({ summary: "Eng yaxshi o‘yinchilarni olish (rating bo‘yicha)" })
  @ApiQuery({ name: "limit", required: false, example: 5 })
  getTopPlayers(@Query("limit") limit?: number) {
    return this.playerStatisticsService.getTopPlayers(limit || 5);
  }

  @Get("analytics/match/:matchId")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH)
  @ApiOperation({ summary: "Match bo‘yicha umumiy gol va o‘rtacha reyting" })
  getMatchGoals(@Param("matchId", ParseIntPipe) matchId: number) {
    return this.playerStatisticsService.getMatchGoals(matchId);
  }

  @Get("analytics/most-carded")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH)
  @ApiOperation({ summary: "Eng ko‘p kartochka olgan o‘yinchilar" })
  @ApiQuery({ name: "limit", required: false, example: 5 })
  getMostCardedPlayers(@Query("limit") limit?: number) {
    return this.playerStatisticsService.getMostCardedPlayers(limit || 5);
  }
}
