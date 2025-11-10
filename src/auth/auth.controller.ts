import { Body, Controller, Get, Post, UseGuards, Req } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { CreateUserDto, LoginDto, RegisterDto } from "../users/dto";
import { Role } from "../common/enum/role.enum";
import type { Request } from "express";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @ApiOperation({
    summary: "Yangi foydalanuvchini ro‘yxatdan o‘tkazish (default PLAYER)",
  })
  @ApiResponse({ status: 201, description: "Foydalanuvchi yaratildi" })
  async signup(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }

  @Post("signin")
  @ApiOperation({ summary: "Tizimga kirish (login)" })
  @ApiResponse({ status: 200, description: "Login muvaffaqiyatli" })
  async signin(@Body() dto: LoginDto) {
    return this.authService.signin(dto);
  }

  @Post("refresh")
  @ApiOperation({ summary: "Access tokenni yangilash" })
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refresh(body.userId, body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("logout")
  @ApiOperation({ summary: "Tizimdan chiqish (token orqali)" })
  async logout(@Req() req: Request) {
    const user = req.user as any;
    return this.authService.logout(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("me")
  @ApiOperation({
    summary: "Profilni olish (faqat avtorizatsiyadan o‘tganlar uchun)",
  })
  async getMe(@Req() req: Request) {
    const user = req.user as any;
    return this.authService.getMe(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @Post("create-by-role")
  @ApiOperation({
    summary: "Admin yoki SuperAdmin yangi foydalanuvchi yaratadi (rol bilan)",
  })
  async createUserByRole(@Req() req: Request, @Body() dto: CreateUserDto) {
    const user = req.user as any;
    return this.authService.createUserByRole(user.id, dto);
  }
}
