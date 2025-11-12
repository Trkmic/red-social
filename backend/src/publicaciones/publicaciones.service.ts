import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';
import { Publicacion } from './publicacion.schema';

@Injectable()
export class PublicacionesService {
    constructor(
        @InjectModel(Publicacion.name)
        private readonly publicacionModel: Model<Publicacion>,
    ) {}

    async crear(data: any): Promise<Publicacion> {
        try {
        const nueva = new this.publicacionModel(data);
        return await nueva.save();
        } catch (error) {
        throw new HttpException(
            'Error al crear la publicación',
            HttpStatus.BAD_REQUEST,
        );
        }
    }

    async obtenerTodas(options: {
        usuario?: string;
        limit?: string;
        offset?: string;
        orden?: 'fecha' | 'likes';
    }): Promise<Publicacion[]> {
            try {
            const { usuario, limit, offset, orden } = options;
        
            const sortOption: { [key: string]: SortOrder } =
                orden === 'likes' ? { likes: -1 } : { createdAt: -1 };
        
            const query = usuario
                ? { usuarioId: usuario }
                : { usuarioId: { $exists: true, $ne: null } };
        
            const publicaciones = await this.publicacionModel
                .find(query)
                .populate({
                path: 'usuarioId',
                select: 'nombreUsuario imagenPerfil',
                strictPopulate: false, 
                })
                .sort(sortOption)
                .skip(offset ? parseInt(offset) : 0)
                .limit(limit ? parseInt(limit) : 0);
        
            return publicaciones;
            } catch (error) {

            throw new HttpException(
                'Error interno al obtener publicaciones',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async eliminar(id: string, userId: string): Promise<{ mensaje: string }> {
        const publicacion = await this.publicacionModel.findById(id);
        if (!publicacion)
        throw new HttpException('Publicación no encontrada', HttpStatus.NOT_FOUND);

        if (publicacion.usuarioId.toString() !== userId)
        throw new HttpException(
            'No tienes permiso para eliminar esta publicación',
            HttpStatus.FORBIDDEN,
        );

        await this.publicacionModel.findByIdAndDelete(id);
        return { mensaje: 'Publicación eliminada correctamente' };
    }

    async darLike(id: string, userId: string): Promise<Publicacion> {
        const publicacion = await this.publicacionModel.findById(id);
        if (!publicacion)
        throw new HttpException('Publicación no encontrada', HttpStatus.NOT_FOUND);
    
        const userObjectId = new Types.ObjectId(userId);
    
        const yaTieneLike = publicacion.likes.some(likeId => likeId.equals(userObjectId));
    
        if (!yaTieneLike) {
        publicacion.likes.push(userObjectId);
        await publicacion.save();
        }
    
        const populated = await this.publicacionModel
        .findById(id)
        .populate('usuarioId', 'nombreUsuario imagenPerfil')
        .exec();
    
        if (!populated)
        throw new HttpException('Error al cargar publicación', HttpStatus.INTERNAL_SERVER_ERROR);
    
        return populated.toObject() as any;
    }
    
    async quitarLike(id: string, userId: string): Promise<Publicacion> {
        const publicacion = await this.publicacionModel.findById(id);
        if (!publicacion)
        throw new HttpException('Publicación no encontrada', HttpStatus.NOT_FOUND);
    
        const userObjectId = new Types.ObjectId(userId);
    
        publicacion.likes = publicacion.likes.filter(
        likeId => !likeId.equals(userObjectId)
        );
    
        await publicacion.save();
    
        const populated = await this.publicacionModel
        .findById(id)
        .populate('usuarioId', 'nombreUsuario imagenPerfil')
        .exec();
    
        if (!populated)
        throw new HttpException('Error al cargar publicación', HttpStatus.INTERNAL_SERVER_ERROR);
    
        return populated.toObject() as any;
    }
}