import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comentario } from './comentario.schema';
import { User } from '../auth/user.schema';

@Injectable()
export class ComentariosService {
    constructor(
        @InjectModel(Comentario.name)
        private readonly comentarioModel: Model<Comentario>,
    ) {}

    async getPorPublicacion(
        publicacionId: string,
        limit: number = 5,
        offset: number = 0,
    ) {
        return this.comentarioModel
        .find({ publicacionId: new Types.ObjectId(publicacionId) })
        .populate('usuarioId', 'nombreUsuario imagenPerfil') 
        .sort({ createdAt: 1 }) 
        .skip(offset)
        .limit(limit)
        .exec();
    }

    /**
     * Crea un nuevo comentario
     */
    async crear(texto: string, usuarioId: string, publicacionId: string) {
                const nuevoComentario = new this.comentarioModel({
                texto,
                usuarioId: new Types.ObjectId(usuarioId),
                publicacionId: new Types.ObjectId(publicacionId),
                });

                const comentarioGuardado = await nuevoComentario.save();

                return comentarioGuardado.populate('usuarioId', 'nombreUsuario imagenPerfil');
    }

    async editar(comentarioId: string, userId: string, texto: string) {
        const comentario = await this.comentarioModel.findById(comentarioId);
    
        if (!comentario) {
            throw new NotFoundException('Comentario no encontrado');
        }
    
        if (comentario.usuarioId.toString() !== userId) {
            throw new UnauthorizedException('No tienes permiso para editar este comentario');
        }
    
        comentario.texto = texto;
        comentario.editado = true; 
        await comentario.save();
        
        return this.comentarioModel.findById(comentarioId).populate('usuarioId', 'nombreUsuario imagenPerfil');
    }
}