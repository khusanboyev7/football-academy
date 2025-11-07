import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { CoachesService } from "./coaches.service";
import { CreateCoachDto } from "./dto/create-coach.dto";
import { UpdateCoachDto } from "./dto/update-coach.dto";
import { Coach } from "./entities/coach.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";

@ApiTags("Coaches")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("coaches")
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Create new coach" })
  @ApiResponse({
    status: 201,
    description: "Coach created successfully",
    type: Coach,
  })
  @ApiResponse({ status: 400, description: "Invalid data or bad request" })
  create(@Body() dto: CreateCoachDto) {
    return this.coachesService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Get all coaches" })
  @ApiResponse({
    status: 200,
    description: "List of coaches returned",
    type: [Coach],
  })
  findAll() {
    return this.coachesService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Get one coach by ID" })
  @ApiResponse({ status: 200, description: "Coach found", type: Coach })
  @ApiResponse({ status: 404, description: "Coach not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.coachesService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Update coach by ID" })
  @ApiResponse({
    status: 200,
    description: "Coach updated successfully",
    type: Coach,
  })
  @ApiResponse({ status: 404, description: "Coach not found" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCoachDto) {
    return this.coachesService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Delete coach by ID" })
  @ApiResponse({
    status: 200,
    description: "Coach deleted successfully",
    type: Coach,
  })
  @ApiResponse({ status: 404, description: "Coach not found" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.coachesService.remove(id);
  }
}
