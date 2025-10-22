import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // 🔹 Carga variables desde el archivo .env
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // 🔹 Habilitar CORS (permite conexión desde Angular en localhost:4200)
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 🔹 Puerto configurable (por .env o 3000 por defecto)
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`Servidor corriendo en http://localhost:${port}`);
}
bootstrap();