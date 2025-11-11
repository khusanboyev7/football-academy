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
import { MatchesService } from "./matches.service";
import { CreateMatchDto } from "./dto/create-match.dto";
import { UpdateMatchDto } from "./dto/update-match.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { Match } from "./entities/match.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";

@ApiTags("Matches")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("matches")
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Yangi match yaratish" })
  @ApiResponse({
    status: 201,
    description: "Match muvaffaqiyatli yaratildi",
    type: Match,
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri ma’lumot kiritildi" })
  @ApiNotFoundResponse({ description: "Home yoki Away jamoasi topilmadi" })
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH, Role.STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Barcha matchlarni olish" })
  @ApiResponse({
    status: 200,
    description: "Matchlar ro‘yxati qaytarildi",
    type: [Match],
  })
  findAll() {
    return this.matchesService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH, Role.STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "ID bo‘yicha bitta matchni olish" })
  @ApiResponse({ status: 200, description: "Match topildi", type: Match })
  @ApiNotFoundResponse({ description: "Berilgan ID bo‘yicha match topilmadi" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.matchesService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Match ma’lumotlarini yangilash" })
  @ApiResponse({
    status: 200,
    description: "Match muvaffaqiyatli yangilandi",
    type: Match,
  })
  @ApiNotFoundResponse({ description: "Match topilmadi" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMatchDto: UpdateMatchDto
  ) {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Matchni o‘chirish" })
  @ApiResponse({
    status: 200,
    description: "Match muvaffaqiyatli o‘chirildi",
    type: Match,
  })
  @ApiNotFoundResponse({ description: "Match topilmadi" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.matchesService.remove(id);
  }
}
