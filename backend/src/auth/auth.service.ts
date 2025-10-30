import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from './user.schema';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async register(dto: RegisterAuthDto, urlImagen?: string) {
        dto.email = dto.email.toLowerCase();
        dto.nombreUsuario = dto.nombreUsuario.toLowerCase();

        if (dto.contraseña !== dto.repetirContraseña) {
        throw new BadRequestException('Las contraseñas no coinciden');
        }

        // Verificar unicidad
        const existing = await this.userModel.findOne({
        $or: [{ email: dto.email }, { nombreUsuario: dto.nombreUsuario }],
        });

        if (existing) {
        if (existing.email === dto.email)
            throw new BadRequestException('El correo ya está registrado');
        if (existing.nombreUsuario === dto.nombreUsuario)
            throw new BadRequestException('El nombre de usuario ya está en uso');
        }

        const hashedPassword = await bcrypt.hash(dto.contraseña, 10);

        const usuario = new this.userModel({
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        nombreUsuario: dto.nombreUsuario,
        password: hashedPassword,
        fechaNacimiento: dto.fechaNacimiento,
        descripcion: dto.descripcion,
        perfil: dto.perfil || 'usuario',
        imagenPerfil: urlImagen || '',
        });

        return await usuario.save();
    }

    async login(dto: LoginAuthDto) {
        const user = await this.userModel.findOne({
        $or: [
            { email: dto.emailOrUsername.toLowerCase() },
            { nombreUsuario: dto.emailOrUsername.toLowerCase() },
        ],
        });

        if (!user) throw new BadRequestException('Usuario no encontrado');

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) throw new BadRequestException('Contraseña incorrecta');

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        // 🔹 Forzamos el tipo de manera segura usando `unknown` antes de castear
        const userObj = user.toObject() as unknown as {
        nombre: string;
        apellido: string;
        email: string;
        nombreUsuario: string;
        password: string;
        fechaNacimiento: string;
        descripcion: string;
        perfil: 'usuario' | 'administrador';
        imagenPerfil?: string;
        };

        const { password, ...usuarioSinPassword } = userObj;

        return { token, usuario: usuarioSinPassword };
    }
}