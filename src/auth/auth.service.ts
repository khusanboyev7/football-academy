import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  OnModuleInit,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { Role } from "../common/enum/role.enum";
import { Tokens, JwtPayload } from "../common/types";
import { RegisterDto, CreateUserDto, LoginDto } from "../users/dto";

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  async onModuleInit() {
    const email = this.config.get<string>("SUPERADMIN_EMAIL");
    const password = this.config.get<string>("SUPERADMIN_PASSWORD");

    if (!email || !password) return;

    const exist = await this.userRepo.findOne({ where: { email } });

    if (!exist) {
      const hash = await bcrypt.hash(password, 10);
      const newSuperAdmin = this.userRepo.create({
        email,
        password: hash,
        role: Role.SUPER_ADMIN,
      });
      await this.userRepo.save(newSuperAdmin);

      console.log("✅ Super Admin avtomatik yaratildi:");
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
    } else {
      console.log(`ℹ️ Super Admin mavjud: ${email}`);
    }
  }

  private async generateTokens(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>("JWT_ACCESS_SECRET"),
      expiresIn: "1h",
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  async signup(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException("Bu email allaqachon mavjud!");

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      role: Role.PLAYER,
    });

    await this.userRepo.save(newUser);

    return {
      message: "🎉 Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi!",
      userId: newUser.id,
    };
  }

  async signin(dto: LoginDto): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException("Email yoki parol noto‘g‘ri!");

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException("Email yoki parol noto‘g‘ri!");

    const { accessToken, refreshToken } = await this.generateTokens(user);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userRepo.update(user.id, { hashedRefreshToken });

    return {
      message: "✅ Muvaffaqiyatli tizimga kirdingiz!",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException("Noto‘g‘ri refresh token!");

    const isValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isValid) throw new UnauthorizedException("Token yaroqsiz!");

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(user);

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.userRepo.update(user.id, { hashedRefreshToken });

    return {
      message: "♻️ Token yangilandi!",
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi!");

    await this.userRepo.update(user.id, { hashedRefreshToken: null });
    return { message: "👋 Tizimdan muvaffaqiyatli chiqdingiz!" };
  }

  async getMe(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi!");

    return {
      message: "👤 Sizning profilingiz:",
      profile: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async createUserByRole(creatorId: number, dto: CreateUserDto) {
    const creator = await this.userRepo.findOne({ where: { id: creatorId } });
    if (!creator) throw new NotFoundException("Foydalanuvchi topilmadi");

    if (dto.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException(
        "SUPER_ADMINni qo‘lda yaratish mumkin emas!"
      );
    }

    if (!dto.role) {
      throw new ForbiddenException("Foydalanuvchi roli ko‘rsatilmagan!");
    }

    if (creator.role === Role.SUPER_ADMIN) {
    } else if (creator.role === Role.ADMIN) {
      if (![Role.STAFF, Role.COACH, Role.PLAYER].includes(dto.role as Role)) {
        throw new ForbiddenException("ADMIN bu rolni yaratolmaydi!");
      }
    } else {
      throw new ForbiddenException("Sizda foydalanuvchi yaratish huquqi yo‘q!");
    }

    const exist = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exist) throw new ConflictException("Bu email allaqachon mavjud!");

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
    });

    await this.userRepo.save(newUser);

    return {
      message: `✅ ${dto.role} foydalanuvchi muvaffaqiyatli yaratildi!`,
      createdBy: creator.email,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }
}
