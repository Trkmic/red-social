import { IsEmail, IsNotEmpty, IsString, MinLength, Validate, IsDateString, IsOptional } from 'class-validator';
import { ValidadorEmail } from '../validaciones/valida-email';
import { DecoradorValidoEmail } from '../validaciones/decorador-valido-email';

export class RegisterAuthDto {
    @IsNotEmpty() 
    @IsString() 
    nombre: string;
    
    @IsNotEmpty() 
    @IsString() 
    apellido: string;

    @IsEmail() 
    @IsNotEmpty()
    @Validate(ValidadorEmail)
    @DecoradorValidoEmail()
    email: string;

    @IsNotEmpty() 
    @IsString() 
    nombreUsuario: string;
    
    @IsString() 
    @MinLength(6) 
    contraseña: string;
    
    @IsString() 
    @IsNotEmpty() 
    repetirContraseña: string;

    @IsNotEmpty() 
    @IsDateString() 
    fechaNacimiento: string;
    
    @IsNotEmpty() 
    @IsString() 
    descripcion: string;

    @IsOptional() 
    @IsString() 
    perfil?: 'usuario' | 'administrador' = 'usuario';
    
    @IsOptional() 
    @IsString() 
    imagenPerfil?: string; // URL de la imagen subida
}