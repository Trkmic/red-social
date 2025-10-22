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
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    descripcion?: string;

    @Prop({ required: true})
    fechaNacimiento?: Date;

    @Prop()
    profileImage?: string;

    @Prop({ default: 'usuario' })
    perfil: string;
}

export const UserSchema = SchemaFactory.createForClass(User);