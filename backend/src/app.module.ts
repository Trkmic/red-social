import { MiddlewareConsumer, NestModule, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ValidarTamanioImagenMiddleware } from './middlewares/validar_tamanio_imagen.middlewares';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule,
    PublicacionesModule,
    DatabaseModule,
  ],
  controllers: [AppController], // 👈 solo el AppController
  providers: [AppService, CloudinaryService], // 👈 no repetir los de Publicaciones
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidarTamanioImagenMiddleware)
      .forRoutes({ path: 'auth/register', method: RequestMethod.POST });
  }
}