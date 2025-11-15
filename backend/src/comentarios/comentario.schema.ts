import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../auth/user.schema';
import { Publicacion } from '../publicaciones/publicacion.schema';

@Schema({ timestamps: true }) // timestamps: true (añade createdAt y updatedAt)
export class Comentario extends Document {
    @Prop({ required: true })
    texto: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    usuarioId: User | Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Publicacion', required: true })
    publicacionId: Publicacion | Types.ObjectId;

    // Para el requisito: "un comentario editado debe anunciar que fue editado"
    @Prop({ default: false })
    editado: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);