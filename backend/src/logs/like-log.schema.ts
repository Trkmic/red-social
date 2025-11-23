import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class LikeLog extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    usuarioId: Types.ObjectId; // Quién dio like

    @Prop({ type: Types.ObjectId, ref: 'Publicacion', required: true })
    publicacionId: Types.ObjectId;

    @Prop({ required: true, default: Date.now })
    fechaLike: Date;
}

export const LikeLogSchema = SchemaFactory.createForClass(LikeLog);
export type LikeLogDocument = LikeLog & Document;