import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Coach } from "../../coaches/entities/coach.entity";
import { Player } from "../../players/entities/player.entity";
import { MediaGallery } from "../../media_gallery/entities/media_gallery.entity";
import { Role } from "../../common";

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  COACH = "coach",
  STAFF = "staff",
  PLAYER = "players",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: Role, default: Role.PLAYER })
  role: Role;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  @OneToMany(() => Coach, (coach) => coach.user)
  coaches: Coach[];

  @OneToMany(() => Player, (player) => player.user)
  players: Player[];

  @OneToMany(() => MediaGallery, (media) => media.uploaded_by)
  media_gallery: MediaGallery[];
}
