import { Controller, Get, Param, NotFoundException, Put, Body, UseInterceptors, UploadedFile, UseGuards, Post, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { AdminGuard } from './admin.guard'; // Importar el nuevo AdminGuard
import { AuthService } from './auth.service'; // Importar AuthService
import { RegisterAuthDto } from './dto/register-auth.dto'; // Importar RegisterAuthDto
import { GetUser } from './jwt/get-user.decorator';
import { LogsService } from '../logs/logs.service';

@Controller('usuarios')
@UseGuards(JwtAuthGuard) // Protege todo el controlador: solo acceso para administradores autenticados
export class UsuariosController {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>, // Se ajusta el tipo a UserDocument
        private readonly cloudinaryService: CloudinaryService,
        private readonly authService: AuthService, // Inyectar AuthService
        private readonly logsService: LogsService,
    ) {}
    
    // **NUEVO: Ver el listado de los usuarios**
    @UseGuards(AdminGuard)
    @Get()
    async getAllUsuarios() {
        const users = await this.userModel.find().select('-password');
        return users;
    }

    @Get(':id')
    // La protección ya está a nivel de clase, solo queda la lógica de logs
    async getUsuarioPorId(@Param('id') profileId: string, @GetUser() loggedUser: any) { // ✅ CORRECCIÓN: Renombrar a 'loggedUser'
        
        const profileOwner = await this.userModel.findById(profileId).select('-password'); // ✅ CORRECCIÓN: Renombrar a 'profileOwner'
        if (!profileOwner) throw new NotFoundException('Usuario no encontrado');

        // LOGGEAR LA VISTA DE PERFIL (si el usuario que ve no es el dueño)
        // Usamos loggedUser._id que viene del JWT
        await this.logsService.logProfileView(loggedUser._id.toString(), profileId);
        
        return profileOwner;
    }

    // **NUEVO: Formulario de registro para nuevos usuarios (creado por administrador)**
    @UseGuards(AdminGuard)
    @Post()
    async createUsuario(@Body() dto: RegisterAuthDto) {
        // Se utiliza el método register de AuthService que maneja hashing, validaciones y perfil.
        // El administrador puede establecer `perfil` en el DTO para elegir si es 'usuario' o 'administrador'.
        const newUser = await this.authService.register(dto);
        
        // Retorna el usuario sin el password
        const { password, ...result } = newUser.toJSON();
        return result;
    }


    // **NUEVO: Acción de alta y baja lógica (habilitar y deshabilitar usuarios)**
    @UseGuards(AdminGuard)
    @Put(':id/habilitar')
    async toggleHabilitado(@Param('id') id: string, @Body('habilitado') habilitado: boolean) {
        
        if (typeof habilitado !== 'boolean') {
            throw new BadRequestException('El campo "habilitado" es obligatorio y debe ser un booleano.');
        }
        
        const userUpdated = await this.userModel.findByIdAndUpdate(
            id, 
            { habilitado: habilitado }, 
            { new: true }
        ).select('-password');
        
        if (!userUpdated) {
            throw new NotFoundException('Usuario no encontrado para actualizar estado de habilitación');
        }
        
        return userUpdated;
    }
    
    // Original: Actualizar usuario (se mantiene, ahora protegido por AdminGuard)
    @UseGuards(AdminGuard)
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