import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UsuariosController } from './usuarios.controller';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UsuariosController],
    providers: [CloudinaryService],
})
export class UsuariosModule {}
