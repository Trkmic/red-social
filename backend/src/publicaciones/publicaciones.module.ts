import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { Publicacion, PublicacionSchema } from './publicacion.schema';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [MongooseModule.forFeature([{ name: Publicacion.name, schema: PublicacionSchema }]),
  AuthModule,
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}
