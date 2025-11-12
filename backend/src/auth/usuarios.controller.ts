import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
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
}
