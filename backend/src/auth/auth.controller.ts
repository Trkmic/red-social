import {Controller,Post,Body,UsePipes,ValidationPipe,UseInterceptors,UploadedFile,HttpCode,HttpStatus} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CloudinaryService, CloudinaryUploadResult } from '../cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}
    
      // Registro de usuario
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseInterceptors(FileInterceptor('imagenPerfil'))
    async register(
        @Body() registerDto: RegisterAuthDto,
        @UploadedFile() archivo?: Express.Multer.File,
    ) {
        let urlImagen: string | undefined;
    
        if (archivo) {
            // Subir la imagen a Cloudinary y obtener la URL
            const resultado: CloudinaryUploadResult = await this.cloudinaryService.uploadImage(archivo, 'usuarios');
            urlImagen = resultado.secure_url;
        }
    
        // Llamar al service pasando la URL de la imagen
        return this.authService.register(registerDto, urlImagen);
    }
    
      // Login de usuario
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async login(@Body() loginDto: LoginAuthDto) {
        return this.authService.login(loginDto);
    }
}