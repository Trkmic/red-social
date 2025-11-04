import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateAuthDto {
    @IsOptional()
    nombre?: string;

    @IsOptional()
    apellido?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    nombreUsuario?: string;

    @IsOptional()
    @MinLength(6)
    password?: string;

    @IsOptional()
    fechaNacimiento?: string;

    @IsOptional()
    descripcion?: string;

    @IsOptional()
    perfil?: 'usuario' | 'administrador';
}