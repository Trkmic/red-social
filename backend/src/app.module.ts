import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { DatabaseModule } from './database/database.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import * as dotenv from 'dotenv';

dotenv.config();
s
@Module({
  imports: [
    
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule,
    PublicacionesModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
