import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { MediaType } from "../entities/media_gallery.entity";

export class CreateMediaGalleryDto {
  @ApiProperty({ example: "Training Photo" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: "https://example.com/photo.jpg" })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  file_url: string;

  @ApiProperty({ enum: MediaType, example: MediaType.IMAGE })
  @IsEnum(MediaType)
  @IsNotEmpty()
  type: MediaType;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  uploadedById: number;
}
