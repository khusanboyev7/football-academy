import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle("Football Academy API ⚽️")
    .setDescription(
      "Football Academy tizimi uchun RESTful API. <br/>\
       Texnologiyalar: NestJS + TypeORM + PostgreSQL. <br/>\
       Modullar: Players, Coaches, Teams, Matches, Performance Reports va boshqalar."
    )
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Bearer token kiriting",
        in: "header",
      },
      "access-token"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(
    `🚀 Football Academy server ishlayapti: http://localhost:${PORT}/api/v1`
  );
  console.log(`📘 Swagger documentation: http://localhost:${PORT}/api/docs`);
}

bootstrap();
