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
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Course } from "./entities/course.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";

@ApiTags("Courses")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Create new course" })
  @ApiResponse({
    status: 201,
    description: "Course created successfully",
    type: Course,
  })
  @ApiResponse({ status: 400, description: "Invalid data or coach not found" })
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Get all courses" })
  @ApiResponse({
    status: 200,
    description: "List of all courses",
    type: [Course],
  })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COACH)
  @ApiOperation({ summary: "Get course by ID" })
  @ApiResponse({ status: 200, description: "Course found", type: Course })
  @ApiResponse({ status: 404, description: "Course not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Update course by ID" })
  @ApiResponse({
    status: 200,
    description: "Course updated successfully",
    type: Course,
  })
  @ApiResponse({ status: 404, description: "Course not found" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Delete course by ID" })
  @ApiResponse({
    status: 200,
    description: "Course deleted successfully",
    type: Course,
  })
  @ApiResponse({ status: 404, description: "Course not found" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}
