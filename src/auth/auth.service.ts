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

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  // ✅ 1. Super Admin auto-create (environment orqali)
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

  // ✅ 2. Register (faqat player yaratiladi)
  async register(dto: any) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException("Bu email allaqachon mavjud!");

    const hash = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepo.create({
      email: dto.email,
      password: hash,
      role: Role.PLAYER, 
    });

    await this.userRepo.save(newUser);

    return {
      message: `🎉 Xush kelibsiz, ${newUser.email}! Siz muvaffaqiyatli ro‘yxatdan o‘tdingiz.`,
    };
  }

  // ✅ 3. Login (faqat access_token)
  async login(dto: any) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException("Email yoki parol noto‘g‘ri!");

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException("Email yoki parol noto‘g‘ri!");

    const payload = { sub: user.id, role: user.role };
    const access_token = await this.jwt.signAsync(payload, {
      secret: this.config.get("JWT_ACCESS_SECRET"),
      expiresIn: this.config.get("JWT_ACCESS_EXPIRE") || "15m",
    });

    return {
      message: `✅ Login muvaffaqiyatli! Xush kelibsiz, ${user.email}.`,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      access_token,
    };
  }

  // ✅ 4. Create Admin (faqat super_admin yaratadi)
  async createAdmin(creatorId: number, dto: any) {
    const creator = await this.userRepo.findOne({ where: { id: creatorId } });
    if (!creator || creator.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException(
        "Faqat Super Admin yangi admin yaratishi mumkin!"
      );
    }

    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException("Bu email allaqachon mavjud!");

    if (dto.role && dto.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException("Super Admin yaratish taqiqlangan!");
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const admin = this.userRepo.create({
      email: dto.email,
      password: hash,
      role: Role.ADMIN,
    });

    await this.userRepo.save(admin);

    return {
      message: `👑 Admin muvaffaqiyatli yaratildi! Email: ${admin.email}`,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  // ✅ 5. Logout
  async logout(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi!");

    return {
      message: `👋 ${user.email}, tizimdan chiqdingiz. Keyingi safar ko‘rishguncha!`,
    };
  }

  // ✅ 6. Refresh Token (faqat mavjud user uchun)
  async refreshToken(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("Bunday foydalanuvchi mavjud emas!");

    const payload = { sub: user.id, role: user.role };
    const access_token = await this.jwt.signAsync(payload, {
      secret: this.config.get("JWT_ACCESS_SECRET"),
      expiresIn: this.config.get("JWT_ACCESS_EXPIRE") || "15m",
    });

    return {
      message: "♻️ Yangi access token muvaffaqiyatli yaratildi!",
      access_token,
    };
  }

  // ✅ 7. getMe (foydalanuvchi profilini olish)
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
}
