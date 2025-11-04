import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // ✅ CORS para local + Vercel (frontend)
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://red-social-sage.vercel.app',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // 🔹 agrega esto
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // 🔹 importante para Render
  console.log(`✅ Servidor corriendo en puerto ${port}`);
}

bootstrap();