import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class LoginLog extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    usuarioId: Types.ObjectId;

    @Prop({ required: true, default: Date.now })
    fechaLogin: Date;
}

export const LoginLogSchema = SchemaFactory.createForClass(LoginLog);
export type LoginLogDocument = LoginLog & Document;