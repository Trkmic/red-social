import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterAuthDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    apellido: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    nombreUsuario: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsNotEmpty({ message: 'Debes repetir la contraseña' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    repeatPassword: string;

    fechaNacimiento?: string;
    descripcion?: string;
    perfil?: string;
}