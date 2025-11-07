import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { TeamsModule } from "./teams/teams.module";
import { CoachesModule } from "./coaches/coaches.module";
import { TrainingsModule } from "./trainings/trainings.module";
import { MediaGalleryModule } from "./media_gallery/media_gallery.module";
import { MatchesModule } from "./matches/matches.module";
import { PerformanceReportsModule } from "./perfonmance_reports/perfonmance_reports.module";
import { PlayersModule } from "./players/players.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { PlayerStatisticsModule } from "./player_statistics/player_statistics.module";
import { PaymentsModule } from "./payments/payments.module";
import { MedicalRecordsModule } from "./medical_records/medical_records.module";
import { EnrollmentsModule } from "./enrollments/enrollments.module";
import { CoursesModule } from "./courses/courses.module";

import { User } from "./users/entities/user.entity";
import { Player } from "./players/entities/player.entity";
import { Team } from "./teams/entities/team.entity";
import { Coach } from "./coaches/entities/coach.entity";
import { Training } from "./trainings/entities/training.entity";
import { MediaGallery } from "./media_gallery/entities/media_gallery.entity";
import { Match } from "./matches/entities/match.entity";
import { PerformanceReport } from "./perfonmance_reports/entities/perfonmance_report.entity";
import { Attendance } from "./attendance/entities/attendance.entity";
import { PlayerStatistic } from "./player_statistics/entities/player_statistic.entity";
import { Payment } from "./payments/entities/payment.entity";
import { MedicalRecord } from "./medical_records/entities/medical_record.entity";
import { Enrollment } from "./enrollments/entities/enrollment.entity";
import { Course } from "./courses/entities/course.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: String(process.env.DB_PASS), // qat’iy string
      database: process.env.DB_NAME,
      entities: [
        User,
        Player,
        Team,
        Coach,
        Training,
        MediaGallery,
        Match,
        PerformanceReport,
        Attendance,
        PlayerStatistic,
        Payment,
        MedicalRecord,
        Enrollment,
        Course,
      ],
      synchronize: true,
    }),

    AuthModule,
    UsersModule,
    TeamsModule,
    CoachesModule,
    TrainingsModule,
    MediaGalleryModule,
    MatchesModule,
    PerformanceReportsModule,
    PlayersModule,
    AttendanceModule,
    PlayerStatisticsModule,
    PaymentsModule,
    MedicalRecordsModule,
    EnrollmentsModule,
    CoursesModule,
  ],
})
export class AppModule {}
