import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from "@nestjs/common";
import { MediaGalleryService } from "./media_gallery.service";
import { CreateMediaGalleryDto } from "./dto/create-media_gallery.dto";
import { UpdateMediaGalleryDto } from "./dto/update-media_gallery.dto";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { MediaGallery } from "./entities/media_gallery.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enum/role.enum";

@ApiTags("Media Gallery")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("media-gallery")
export class MediaGalleryController {
  constructor(private readonly mediaGalleryService: MediaGalleryService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Yangi media fayl qo‘shish" })
  @ApiResponse({
    status: 201,
    description: "Media muvaffaqiyatli yaratildi",
    type: MediaGallery,
  })
  @ApiBadRequestResponse({ description: "Noto‘g‘ri ma’lumot kiritildi" })
  create(@Body() createMediaGalleryDto: CreateMediaGalleryDto) {
    return this.mediaGalleryService.create(createMediaGalleryDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Barcha media fayllarni olish" })
  @ApiResponse({
    status: 200,
    description: "Media fayllar ro‘yxati qaytarildi",
    type: [MediaGallery],
  })
  findAll() {
    return this.mediaGalleryService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "ID bo‘yicha bitta media faylni olish" })
  @ApiResponse({
    status: 200,
    description: "Media topildi",
    type: MediaGallery,
  })
  @ApiNotFoundResponse({ description: "Berilgan ID bo‘yicha media topilmadi" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.mediaGalleryService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Media ma’lumotlarini yangilash" })
  @ApiResponse({
    status: 200,
    description: "Media muvaffaqiyatli yangilandi",
    type: MediaGallery,
  })
  @ApiNotFoundResponse({ description: "Media topilmadi" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMediaGalleryDto: UpdateMediaGalleryDto
  ) {
    return this.mediaGalleryService.update(id, updateMediaGalleryDto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Media faylni o‘chirish" })
  @ApiResponse({
    status: 200,
    description: "Media muvaffaqiyatli o‘chirildi",
    type: MediaGallery,
  })
  @ApiNotFoundResponse({ description: "Media topilmadi" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.mediaGalleryService.remove(id);
  }
}
