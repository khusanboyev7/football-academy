import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaGallery } from "./entities/media_gallery.entity";
import { MediaGalleryService } from "./media_gallery.service";
import { MediaGalleryController } from "./media_gallery.controller";
import { AuthModule } from "../auth/auth.module";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MediaGallery, User]), AuthModule],
  controllers: [MediaGalleryController],
  providers: [MediaGalleryService],
  exports: [MediaGalleryService],
})
export class MediaGalleryModule {}
