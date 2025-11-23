import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ProfileViewLog extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    viewerId: Types.ObjectId; // Quién vio el perfil

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    profileOwnerId: Types.ObjectId; // El dueño del perfil

    @Prop({ required: true, default: Date.now })
    fechaVista: Date;
}

export const ProfileViewLogSchema = SchemaFactory.createForClass(ProfileViewLog);
export type ProfileViewLogDocument = ProfileViewLog & Document;