import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { Publicacion, PublicacionSchema } from './publicacion.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User, UserSchema } from '../auth/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
      { name: User.name, schema: UserSchema }
    ]),
    AuthModule,
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService, CloudinaryService],
  exports: [PublicacionesService],
})
export class PublicacionesModule {}
