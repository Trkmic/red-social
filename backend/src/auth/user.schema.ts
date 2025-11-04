import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true })
    apellido: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    nombreUsuario: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    fechaNacimiento: string;

    @Prop({ required: true })
    descripcion: string;

    @Prop({ default: 'usuario' })
    perfil: 'usuario' | 'administrador';

    @Prop()
    imagenPerfil?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

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
