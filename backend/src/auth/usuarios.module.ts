import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UsuariosController } from './usuarios.controller';

import { AuthModule } from './auth.module'; 
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; 
import { LogsModule } from '../logs/logs.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        AuthModule, 
        CloudinaryModule,
        LogsModule 
    ],
    controllers: [UsuariosController],
    
    providers: [], 
})
export class UsuariosModule {}