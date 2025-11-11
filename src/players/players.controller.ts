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
import { PlayersService } from "./players.service";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { Player } from "./entities/player.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";

@ApiTags("Players")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Yangi player yaratish" })
  @ApiResponse({
    status: 201,
    description: "Player muvaffaqiyatli yaratildi",
    type: Player,
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri ma’lumot kiritildi" })
  create(@Body() dto: CreatePlayerDto) {
    return this.playersService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Barcha playerlarni olish" })
  @ApiResponse({
    status: 200,
    description: "Playerlar ro‘yxati qaytarildi",
    type: [Player],
  })
  findAll() {
    return this.playersService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.PLAYER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "ID bo‘yicha playerni olish" })
  @ApiResponse({ status: 200, description: "Player topildi", type: Player })
  @ApiNotFoundResponse({ description: "Berilgan ID bo‘yicha player topilmadi" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Player ma’lumotlarini yangilash" })
  @ApiResponse({
    status: 200,
    description: "Player muvaffaqiyatli yangilandi",
    type: Player,
  })
  @ApiNotFoundResponse({ description: "Player topilmadi" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdatePlayerDto) {
    return this.playersService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Playerni o‘chirish" })
  @ApiResponse({
    status: 200,
    description: "Player muvaffaqiyatli o‘chirildi",
    type: Player,
  })
  @ApiNotFoundResponse({ description: "Player topilmadi" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.playersService.remove(id);
  }
}
