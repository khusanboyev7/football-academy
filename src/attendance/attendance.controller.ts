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
import { AttendanceService } from "./attendance.service";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";
import { Attendance } from "./entities/attendance.entity";

@ApiTags("Attendance")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Create new attendance record" })
  @ApiResponse({
    status: 201,
    description: "Attendance created successfully",
    type: Attendance,
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH)
  @ApiOperation({ summary: "Get all attendance records" })
  @ApiResponse({
    status: 200,
    description: "List of attendance records",
    type: [Attendance],
  })
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Get attendance by ID" })
  @ApiResponse({
    status: 200,
    description: "Attendance record found",
    type: Attendance,
  })
  @ApiResponse({ status: 404, description: "Attendance record not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Update attendance by ID" })
  @ApiResponse({
    status: 200,
    description: "Attendance updated successfully",
    type: Attendance,
  })
  @ApiResponse({ status: 404, description: "Attendance record not found" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto
  ) {
    return this.attendanceService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Delete attendance by ID" })
  @ApiResponse({
    status: 200,
    description: "Attendance deleted",
    type: Attendance,
  })
  @ApiResponse({ status: 404, description: "Attendance record not found" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.attendanceService.remove(id);
  }
}
