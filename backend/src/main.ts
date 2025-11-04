import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar CORS para Render + Vercel + desarrollo local
  app.enableCors({
    origin: [
      'http://localhost:4200', // desarrollo local
      'https://red-social-sage.vercel.app' // 🔹 tu frontend en Vercel
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✅ Servidor corriendo en puerto ${port}`);
}

bootstrap();