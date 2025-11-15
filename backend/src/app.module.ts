import { MiddlewareConsumer, NestModule, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './auth/usuarios.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ValidarTamanioImagenMiddleware } from './middlewares/validar_tamanio_imagen.middlewares';
import { ComentariosModule } from './comentarios/comentarios.module';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule, 
    PublicacionesModule,
    DatabaseModule,
    UsuariosModule,
    ComentariosModule],
  controllers: [AppController], 
  providers: [AppService, CloudinaryService], 
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidarTamanioImagenMiddleware)
      .forRoutes({ path: 'auth/register', method: RequestMethod.POST });
  }
}