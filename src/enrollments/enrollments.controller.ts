import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { EnrollmentsService } from "./enrollments.service";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { UpdateEnrollmentDto } from "./dto/update-enrollment.dto";
import { Enrollment } from "./entities/enrollment.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";

@ApiTags("Enrollments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("enrollments")
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: "Create new enrollment" })
  @ApiResponse({
    status: 201,
    description: "Enrollment created successfully",
    type: Enrollment,
  })
  @ApiResponse({ status: 400, description: "Invalid data" })
  create(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Get all enrollments" })
  @ApiResponse({
    status: 200,
    description: "List of enrollments",
    type: [Enrollment],
  })
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Get enrollment by ID" })
  @ApiResponse({
    status: 200,
    description: "Enrollment found",
    type: Enrollment,
  })
  @ApiResponse({ status: 404, description: "Enrollment not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.enrollmentsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: "Update enrollment by ID" })
  @ApiResponse({
    status: 200,
    description: "Enrollment updated successfully",
    type: Enrollment,
  })
  @ApiResponse({ status: 404, description: "Enrollment not found" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateEnrollmentDto
  ) {
    return this.enrollmentsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Delete enrollment by ID" })
  @ApiResponse({
    status: 200,
    description: "Enrollment deleted successfully",
    type: Enrollment,
  })
  @ApiResponse({ status: 404, description: "Enrollment not found" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.enrollmentsService.remove(id);
  }
}
