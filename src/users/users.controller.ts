import { Controller, Get, Param, Delete, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { User } from "./entities/user.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { Roles } from "../common/decorators";
import { Role } from "../common/enum/role.enum";
import { RolesGuard } from "../common/guards";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "List of users", type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Get a user by ID" })
  @ApiResponse({ status: 200, description: "User found", type: User })
  @ApiResponse({ status: 404, description: "User not found" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Delete a user" })
  @ApiResponse({ status: 200, description: "User deleted", type: User })
  @ApiResponse({ status: 404, description: "User not found" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
