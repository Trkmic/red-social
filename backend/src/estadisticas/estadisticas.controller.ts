import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('estadisticas')
@UseGuards(JwtAuthGuard, AdminGuard) 
export class EstadisticasController {
    constructor(private readonly estadisticasService: EstadisticasService) {}

    @Get('publicaciones-por-usuario')
    publicacionesPorUsuario(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.estadisticasService.publicacionesPorUsuario(fechaInicio, fechaFin);
    }

    @Get('comentarios-totales')
    comentariosTotales(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.estadisticasService.comentariosTotales(fechaInicio, fechaFin);
    }

    @Get('comentarios-por-publicacion')
    comentariosPorPublicacion(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.estadisticasService.comentariosPorPublicacion(fechaInicio, fechaFin);
    }

    @Get('logins-por-usuario')
    loginsPorUsuario(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.estadisticasService.loginsPorUsuario(fechaInicio, fechaFin);
    }

    @Get('visitas-perfil-por-dia')
    visitasPerfilPorDia(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.estadisticasService.visitasPerfilPorDia(fechaInicio, fechaFin);
    }

    @Get('likes-otorgados-por-dia')
    likesOtorgadosPorDia(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.estadisticasService.likesOtorgadosPorDia(fechaInicio, fechaFin);
    }
}