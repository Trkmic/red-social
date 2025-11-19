import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from '../publicaciones/publicacion.schema';
import { Comentario, ComentarioSchema } from '../comentarios/comentario.schema';
import { User, UserSchema } from '../auth/user.schema';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';
import { LoginLog, LoginLogSchema } from '../logs/login-log.schema'; 
import { LikeLog, LikeLogSchema } from '../logs/like-log.schema';
import { ProfileViewLog, ProfileViewLogSchema } from '../logs/profile-view-log.schema';
@Module({
    imports: [
        MongooseModule.forFeature([
        { name: Publicacion.name, schema: PublicacionSchema },
        { name: Comentario.name, schema: ComentarioSchema },
        { name: User.name, schema: UserSchema },
        { name: LoginLog.name, schema: LoginLogSchema }, 
        { name: LikeLog.name, schema: LikeLogSchema },
        { name: ProfileViewLog.name, schema: ProfileViewLogSchema },
        ]),
    ],
    controllers: [EstadisticasController],
    providers: [EstadisticasService],
})
export class EstadisticasModule {}