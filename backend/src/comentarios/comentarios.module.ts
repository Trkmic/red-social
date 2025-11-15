import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from './comentario.schema';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';

@Module({
    imports: [
        MongooseModule.forFeature([
        { name: Comentario.name, schema: ComentarioSchema },
        ]),
    ],
    controllers: [ComentariosController],
    providers: [ComentariosService],
})
export class ComentariosModule {}