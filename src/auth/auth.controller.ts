import { Body, Controller, Post, UseGuards, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, CreateAdminDto, RefreshTokenDto } from "../users/dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { GetUser } from "../common/decorators/get-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ User Registration
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ✅ User Login
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ✅ Create Admin (only SuperAdmin)
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post("create-admin")
  createAdmin(
    @GetUser("id") superAdminId: number,
    @Body() dto: CreateAdminDto
  ) {
    return this.authService.createAdmin(superAdminId, dto);
  }

  // ✅ Logout
  @Post("logout")
  logout(@Body() dto: LoginDto) {
    return this.authService.logout(dto.email);
  }

  // ✅ Refresh Token
  @Post("refresh")
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.userId);
  }

  // ✅ Current user info
  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@GetUser() user: any) {
    return { message: "Authenticated user", user };
  }
}
