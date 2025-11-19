import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UsuariosController } from './usuarios.controller';
// import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Eliminada, se obtendrá del módulo
import { AuthModule } from './auth.module'; // ¡Nuevo! Importamos AuthModule para obtener AuthService
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // ¡Nuevo! Importamos CloudinaryModule

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        AuthModule, // Para obtener AuthService
        CloudinaryModule // Para obtener CloudinaryService
    ],
    controllers: [UsuariosController],
    // Eliminamos CloudinaryService de providers ya que se obtiene de CloudinaryModule
    providers: [], 
})
export class UsuariosModule {}