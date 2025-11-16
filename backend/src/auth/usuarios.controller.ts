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
        @UploadedFile() file: Express.Multer.File, 
        @Body() data: any, 
    ) {
        
        if (file) {
            try {
                const imageUrl = await this.cloudinaryService.uploadImage(file, 'usuarios');
                data.imagenPerfil = imageUrl; 
            } catch (error) {
            }
        }
        const userUpdated = await this.userModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
        
        if (!userUpdated) {
            throw new NotFoundException('Usuario no encontrado para actualizar');
        }
        
        return userUpdated;
    }

}
