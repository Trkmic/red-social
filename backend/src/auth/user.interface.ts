export interface IUser {
    nombre: string;
    apellido: string;
    email: string;
    nombreUsuario: string;
    password: string;
    fechaNacimiento: string;
    descripcion: string;
    perfil: 'usuario' | 'administrador';
    imagenPerfil?: string;
}
