import { Controller, Get, Param, NotFoundException, Put, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Controller('usuarios')
export class UsuariosController {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}

    @Get(':id')
    async getUsuarioPorId(@Param('id') id: string) {
        const user = await this.userModel.findById(id).select('-password');
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }


    @Put(':id')
    async actualizarUsuario(
        @Param('id') id: string,
        @Body() data: any, // { nombre, apellido, descripcion }
    ) {
        // Buscamos el usuario por ID y lo actualizamos con los datos del body
        // { new: true } devuelve el documento actualizado
        const userUpdated = await this.userModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
        
        if (!userUpdated) {
            throw new NotFoundException('Usuario no encontrado para actualizar');
        }
        
        // Devolvemos el usuario actualizado (sin password)
        // El 'tap' en tu auth.service (frontend) lo guardará en localStorage
        return userUpdated;
    }
}
