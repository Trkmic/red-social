import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion } from './publicacion.schema';
import { SortOrder } from 'mongoose';

@Injectable()
export class PublicacionesService {

constructor(
    @InjectModel(Publicacion.name)
    private publicacionModel: Model<Publicacion>,
    ) {}

    async crear(data: any): Promise<Publicacion> {
        const nueva = new this.publicacionModel(data);
        return nueva.save();
    }

    async obtenerTodas(options: { limit?: string; offset?: string; orden?: 'fecha' | 'likes' }): Promise<Publicacion[]> {
        const { limit, offset, orden } = options;
    
        let sortOption: { [key: string]: SortOrder } = { createdAt: -1 }; // por defecto por fecha
        if (orden === 'likes') {
            sortOption = { likes: -1 }; // más likes primero
        }
    
        return this.publicacionModel
            .find()
            .populate('usuarioId', 'username')
            .sort(sortOption)
            .skip(offset ? parseInt(offset) : 0)
            .limit(limit ? parseInt(limit) : 0);
    }

    async eliminar(id: string): Promise<void> {
        await this.publicacionModel.findByIdAndDelete(id);
    }

    async darLike(id: string, userId: string) {
        const publicacion = await this.publicacionModel.findById(id);
        if (!publicacion) throw new Error('Publicación no encontrada');
    
        if (!publicacion.likes.includes(userId as any)) {
            publicacion.likes.push(userId as any);
        }
    
        return publicacion.save();
    }
    
    async quitarLike(id: string, userId: string) {
        const publicacion = await this.publicacionModel.findById(id);
        if (!publicacion) throw new Error('Publicación no encontrada');
    
        publicacion.likes = publicacion.likes.filter(
            (likeId) => likeId.toString() !== userId
        );
    
        return publicacion.save();
    }
}