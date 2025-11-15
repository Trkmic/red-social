import { Controller, Get, Param, NotFoundException, Put, Body,UseInterceptors,UploadedFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


@Controller('usuarios')
export class UsuariosController {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Get(':id')
    async getUsuarioPorId(@Param('id') id: string) {
        const user = await this.userModel.findById(id).select('-password');
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }


    @Put(':id')
    @UseInterceptors(FileInterceptor('imagenPerfil', { storage: memoryStorage() }))
    async actualizarUsuario(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File, // 5. Recibir el archivo
        @Body() data: any, // { nombre, apellido, descripcion }
    ) {
        
        // 6. Si se sube un archivo nuevo...
        if (file) {
            try {
                const imageUrl = await this.cloudinaryService.uploadImage(file, 'usuarios');
                data.imagenPerfil = imageUrl; // 7. Añadir la nueva URL a los datos
            } catch (error) {
                console.error('Error al subir imagen a Cloudinary:', error);
                // Opcional: manejar el error si la subida falla
            }
        }
        // 8. Actualizar la DB con los datos (incluyendo la nueva imagenPerfil si existe)
        const userUpdated = await this.userModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
        
        if (!userUpdated) {
            throw new NotFoundException('Usuario no encontrado para actualizar');
        }
        
        return userUpdated;
    }

}
