import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async register(data: any) {
        // Validar campos obligatorios
        if (!data.email || !data.username || !data.password || !data.nombre || !data.apellido) {
            throw new BadRequestException('Faltan campos obligatorios');
        }
    
        // Normalizar
        data.email = data.email.toLowerCase();
        data.username = data.username.toLowerCase();
    
        // Validar duplicados
        const existingEmail = await this.userModel.findOne({ email: data.email });
        if (existingEmail) throw new BadRequestException('El correo ya está registrado');
    
        const existingUsername = await this.userModel.findOne({ username: data.username });
        if (existingUsername) throw new BadRequestException('El nombre de usuario ya está en uso');
    
        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(data.password, 10);
    
        try {
            const createdUser = new this.userModel({ ...data, password: hashedPassword });
            return await createdUser.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new BadRequestException('Email o nombre de usuario ya en uso');
            }
            throw error;
        }
    }

    async login(data: any) {
        const user = await this.userModel.findOne({
            $or: [{ email: data.emailOrUsername }, { username: data.emailOrUsername }],
        });

        if (!user) throw new BadRequestException('Usuario no encontrado');

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) throw new BadRequestException('Contraseña incorrecta');

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return { token };
    }
}
