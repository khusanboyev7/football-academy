import { ApiProperty } from "@nestjs/swagger";
import { MediaType } from "../entities/media_gallery.entity";

export class CreateMediaGalleryDto {
  @ApiProperty({ example: "Training Photo" })
  title: string;

  @ApiProperty({ example: "https://example.com/photo.jpg" })
  file_url: string;

  @ApiProperty({ enum: MediaType, example: MediaType.IMAGE })
  type: MediaType;

  @ApiProperty({ example: 1 })
  uploadedById: number;
}
