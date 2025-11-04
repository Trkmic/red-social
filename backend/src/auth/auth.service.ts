import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) {}

    async generateJwt(user: UserDocument) {
        const payload = { sub: user._id, nombreUsuario: user.nombreUsuario, email: user.email };
        return this.jwtService.sign(payload);
    }

    async validateUser(emailOrUsername: string, password: string) {
        const query = {
            $or: [
                { email: emailOrUsername.toLowerCase() },
                { nombreUsuario: emailOrUsername.toLowerCase() },
                ],
        };
    
        console.log('Intentando login con:', emailOrUsername);
        const user = await this.userModel.findOne(query);
        console.log('Usuario encontrado:', user);
        
        if (!user) return null;
        
        const passwordValid = await bcrypt.compare(password, user.password);
        console.log('Password válido?', passwordValid);
        if (!passwordValid) return null;
        
        return user;
    }

    async register(dto: RegisterAuthDto, imagenUrl?: string) {
        dto.email = dto.email.toLowerCase();
        dto.nombreUsuario = dto.nombreUsuario.toLowerCase();
    
        if (dto.password !== dto.repeatPassword) {
            throw new BadRequestException('Las contraseñas no coinciden');
        }
    
        // Verificamos que no exista ya el email o nombre de usuario
        const existing = await this.userModel.findOne({
            $or: [{ email: dto.email }, { nombreUsuario: dto.nombreUsuario }],
        });
    
        if (existing) {
            if (existing.email === dto.email)
                throw new BadRequestException('El correo ya está registrado');
            if (existing.nombreUsuario === dto.nombreUsuario)
                throw new BadRequestException('El nombre de usuario ya está en uso');
        }
    
        const hashedPassword = await bcrypt.hash(dto.password, 10);
    
        const usuario = new this.userModel({
            nombre: dto.nombre,
            apellido: dto.apellido,
            email: dto.email,
            nombreUsuario: dto.nombreUsuario,
            password: hashedPassword,
            fechaNacimiento: dto.fechaNacimiento || '',
            descripcion: dto.descripcion || '',
            perfil: dto.perfil || 'usuario',
            imagenPerfil: imagenUrl || '',
        });
    
        console.log('Usuario a guardar:', usuario); // 🔍 Ver en consola antes de guardar
    
        return await usuario.save();
    }
}