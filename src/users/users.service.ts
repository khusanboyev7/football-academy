import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  // Foydalanuvchilarni olish
  findAll() {
    return this.userRepo.find({
      relations: ["coaches", "players", "media_gallery"],
    });
  }

  // ID bo'yicha bitta foydalanuvchini olish
  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ["coaches", "players", "media_gallery"],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // Foydalanuvchini o'chirish
  async remove(id: number) {
    const user = await this.findOne(id); // NotFoundException tekshirish
    return this.userRepo.remove(user);
  }
}
