import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateMediaGalleryDto } from "./dto/create-media_gallery.dto";
import { UpdateMediaGalleryDto } from "./dto/update-media_gallery.dto";
import { Repository } from "typeorm";
import { MediaGallery } from "./entities/media_gallery.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";

@Injectable()
export class MediaGalleryService {
  constructor(
    @InjectRepository(MediaGallery)
    private mediaGalleryRepository: Repository<MediaGallery>,



    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(dto: CreateMediaGalleryDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: dto.uploadedById },
      });
      if (!user) throw new BadRequestException("User topilmadi");

      const media = this.mediaGalleryRepository.create({
        title: dto.title,
        file_url: dto.file_url,
        type: dto.type,
        uploaded_by: user,
      });

      await this.mediaGalleryRepository.save(media);
      return {
        success: true,
        message: "Media muvaffaqiyatli yaratildi ✅",
        data: media,
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || "Media yaratishda xatolik yuz berdi ❌"
      );
    }
  }

  async findAll() {
    try {
      const medias = await this.mediaGalleryRepository.find({
        relations: ["uploaded_by"],
      });
      return {
        success: true,
        message: "Barcha media fayllar ro‘yxati",
        data: medias,
      };
    } catch (error) {
      throw new BadRequestException(
        "Media fayllarni olishda xatolik yuz berdi ❌"
      );
    }
  }

  async findOne(id: number) {
    const media = await this.mediaGalleryRepository.findOne({
      where: { id },
      relations: ["uploaded_by"],
    });
    if (!media)
      throw new NotFoundException(`ID ${id} bo‘yicha media topilmadi ❌`);
    return { success: true, message: "Media topildi ✅", data: media };
  }

  async update(id: number, updateMediaGalleryDto: UpdateMediaGalleryDto) {
    const media = await this.mediaGalleryRepository.preload({
      id,
      ...updateMediaGalleryDto,
    });
    if (!media)
      throw new NotFoundException(`ID ${id} bo‘yicha media topilmadi ❌`);
    await this.mediaGalleryRepository.save(media);
    return {
      success: true,
      message: "Media muvaffaqiyatli yangilandi ✅",
      data: media,
    };
  }

  async remove(id: number) {
    const media = await this.mediaGalleryRepository.findOne({ where: { id } });
    if (!media)
      throw new NotFoundException(`ID ${id} bo‘yicha media topilmadi ❌`);
    await this.mediaGalleryRepository.remove(media);
    return { success: true, message: "Media muvaffaqiyatli o‘chirildi ✅" };
  }
}
