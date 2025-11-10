import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";

const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message }) =>
            `[${timestamp}] ${level}: ${message}`
        )
      ),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
};

async function bootstrap() {
  const PORT = process.env.PORT || 3030;

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.use(cookieParser());

  app.setGlobalPrefix("api/v1");

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  })
);

  const config = new DocumentBuilder()
    .setTitle("Football Academy API ⚽️")
    .setDescription(
      "Football Academy tizimi uchun RESTful API. <br/>" +
        "Texnologiyalar: NestJS + TypeORM + PostgreSQL. <br/>" +
        "Modullar: Players, Coaches, Teams, Matches, Performance Reports va boshqalar."
    )
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer", 
        bearerFormat: "JWT",
        in: "header", 
        name: "Authorization",
        description:
          "Foydalanuvchi JWT tokenini kiriting. Format: Bearer <token>",
      }
    )

    .addTag("Football Academy, NestJS, TypeORM, JWT")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(PORT);

  console.log(
    `🚀 Football Academy server ishlayapti: http://localhost:${PORT}/api/v1`
  );
  console.log(`📘 Swagger documentation: http://localhost:${PORT}/api/docs`);
}

bootstrap();
