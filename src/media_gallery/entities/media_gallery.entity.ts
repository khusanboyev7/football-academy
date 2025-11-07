import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
}

@Entity("media_gallery")
export class MediaGallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  file_url: string;

  @Column({ type: "enum", enum: MediaType })
  type: MediaType;

  @ManyToOne(() => User, (user) => user.media_gallery, { onDelete: "SET NULL" })
  uploaded_by: User;

  @CreateDateColumn({ name: "uploaded_at" })
  uploaded_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
