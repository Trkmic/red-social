import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { Publicacion, PublicacionDocument } from '../publicaciones/publicacion.schema';
import { Comentario, ComentarioDocument } from '../comentarios/comentario.schema';
import { User, UserDocument } from '../auth/user.schema';
import { LoginLog, LoginLogDocument } from '../logs/login-log.schema'; // 👈 Importar
import { LikeLog, LikeLogDocument } from '../logs/like-log.schema';       // 👈 Importar
import { ProfileViewLog, ProfileViewLogDocument } from '../logs/profile-view-log.schema'; // 👈 Importar

@Injectable()
export class EstadisticasService {
    constructor(
        @InjectModel(Publicacion.name) private publicacionModel: Model<PublicacionDocument>,
        @InjectModel(Comentario.name) private comentarioModel: Model<ComentarioDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(LoginLog.name) private loginLogModel: Model<LoginLogDocument>, // 👈 Inyectar
        @InjectModel(LikeLog.name) private likeLogModel: Model<LikeLogDocument>,   // 👈 Inyectar
        @InjectModel(ProfileViewLog.name) private profileViewLogModel: Model<ProfileViewLogDocument>, // 👈 Inyectar
    ) {}

    // Helper para construir el filtro de fechas
    private getMatchQuery(fechaInicio: string, fechaFin: string, campoFecha: string = 'createdAt') {
        const query: any = {};
        if (fechaInicio) {
        query.$gte = new Date(fechaInicio);
        }
        if (fechaFin) {
        const endDate = new Date(fechaFin);
        endDate.setDate(endDate.getDate() + 1); // Incluir todo el día final
        query.$lt = endDate;
        }
        return Object.keys(query).length > 0 ? { [campoFecha]: query } : {};
    }

    // ■ Publicaciones realizadas por cada usuario (para Gráfico de Torta/Barras)
    async publicacionesPorUsuario(fechaInicio: string, fechaFin: string) {
        const matchQuery = this.getMatchQuery(fechaInicio, fechaFin);

        return this.publicacionModel.aggregate([
        { $match: matchQuery },
        {
            $group: {
            _id: '$usuarioId',
            cantidad: { $sum: 1 },
            },
        },
        // Obtener el nombre de usuario para el gráfico
        {
            $lookup: {
            from: 'users', 
            localField: '_id',
            foreignField: '_id',
            as: 'usuarioDetalle',
            },
        },
        { $unwind: '$usuarioDetalle' },
        {
            $project: {
            _id: 0,
            usuarioId: '$_id',
            nombreUsuario: '$usuarioDetalle.nombreUsuario',
            cantidad: '$cantidad',
            },
        },
        { $sort: { cantidad: -1 } },
        ]);
    }

    // ■ Cantidad de comentarios realizados por día (para Gráfico de Líneas)
    async comentariosTotales(fechaInicio: string, fechaFin: string) {
        const matchQuery = this.getMatchQuery(fechaInicio, fechaFin);

        const resultado = await this.comentarioModel.aggregate([
        { $match: matchQuery },
        {
            $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            cantidad: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } }, // Ordenar por fecha
        ]);
        
        return resultado.map(item => ({
            fecha: item._id,
            cantidad: item.cantidad
        }));
    }

    // ■ Cantidad de comentarios en cada publicación (para Gráfico de Barras)
    async comentariosPorPublicacion(fechaInicio: string, fechaFin: string) {
        const matchQuery = this.getMatchQuery(fechaInicio, fechaFin);

        return this.comentarioModel.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$publicacionId',
                    cantidad: { $sum: 1 },
                },
            },
            // Obtener el título de la publicación
            {
                $lookup: {
                    from: 'publicacions', 
                    localField: '_id',
                    foreignField: '_id',
                    as: 'publicacionDetalle',
                },
            },
            { $unwind: { path: '$publicacionDetalle', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    publicacionId: '$_id',
                    // Usar título o un placeholder si la publicación fue eliminada
                    tituloPublicacion: { $ifNull: ['$publicacionDetalle.titulo', 'Publicación Eliminada'] },
                    cantidad: '$cantidad',
                },
            },
            { $sort: { cantidad: -1 } }
        ]);
    }

    async loginsPorUsuario(fechaInicio: string, fechaFin: string) {
        const matchQuery = this.getMatchQuery(fechaInicio, fechaFin, 'fechaLogin');
    
        return this.loginLogModel.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: '$usuarioId',
              cantidad: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: 'users', // nombre de la colección de usuarios
              localField: '_id',
              foreignField: '_id',
              as: 'usuarioDetalle',
            },
          },
          { $unwind: '$usuarioDetalle' },
          {
            $project: {
              _id: 0,
              nombreUsuario: '$usuarioDetalle.nombreUsuario',
              cantidad: '$cantidad',
            },
          },
          { $sort: { cantidad: -1 } },
        ]);
      }
    
      // ■ Cantidad de visitas a mi perfil (por parte de usuarios que no sean uno mismo) (para Gráfico de Líneas)
      async visitasPerfilPorDia(fechaInicio: string, fechaFin: string) {
        // El logProfileView ya filtra para que no se cuenten las visitas propias
        const matchQuery = this.getMatchQuery(fechaInicio, fechaFin, 'fechaVista');
    
        const resultado = await this.profileViewLogModel.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$fechaVista' } },
                    cantidad: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        
        return resultado.map(item => ({
            fecha: item._id,
            cantidad: item.cantidad
        }));
      }
    
      // ■ Cantidad de me gusta otorgados por día (para Gráfico de Líneas)
      async likesOtorgadosPorDia(fechaInicio: string, fechaFin: string) {
        const matchQuery = this.getMatchQuery(fechaInicio, fechaFin, 'fechaLike');
    
        const resultado = await this.likeLogModel.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$fechaLike' } },
                    cantidad: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        
        return resultado.map(item => ({
            fecha: item._id,
            cantidad: item.cantidad
        }));
      }
}

