import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaGalleryDto } from './create-media_gallery.dto';

export class UpdateMediaGalleryDto extends PartialType(CreateMediaGalleryDto) {}
