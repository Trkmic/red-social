import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // ✅ Configuración robusta de CORS
  app.enableCors({
    origin: [
      'http://localhost:4200', // desarrollo local
      'https://red-social-sage.vercel.app', // dominio de producción en Vercel
      'https://red-social-gxjeq06pf-ignacios-projects-d7c4c7c5.vercel.app', // build temporal Vercel
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // 🔹 importante para JWT o formularios
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // 🔹 necesario para Render
  console.log(`✅ Servidor corriendo en puerto ${port}`);
  console.log(`🌐 CORS habilitado para:`);
  console.log(`   - http://localhost:4200`);
  console.log(`   - https://red-social-sage.vercel.app`);
  console.log(`   - https://red-social-gxjeq06pf-ignacios-projects-d7c4c7c5.vercel.app`);
}

bootstrap();