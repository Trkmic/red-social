import { Controller, Get, Post, Put, Param, Query, Body, UseGuards, Request, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ComentariosService } from './comentarios.service';

@Controller('comentarios')
export class ComentariosController {
    constructor(private readonly comentariosService: ComentariosService) {}

    /**
     * Obtener comentarios paginados de una publicación
     * GET /comentarios/publicacion/ID_PUBLICACION?limit=5&offset=0
     */
    @Get('publicacion/:id')
    async getPorPublicacion(
        @Param('id') publicacionId: string,
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    ) {
        return this.comentariosService.getPorPublicacion(publicacionId, limit, offset);
    }

    /**
     * Crear un nuevo comentario
     * POST /comentarios
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    async crear(
        @Request() req: any,
        @Body('texto') texto: string,
        @Body('publicacionId') publicacionId: string,
    ) {
        const userId = req.user._id; // Obtenido del token (JwtAuthGuard)
        return this.comentariosService.crear(texto, userId, publicacionId);
    }

    /**
     * Editar un comentario
     * PUT /comentarios/ID_COMENTARIO
     */
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async editar(
        @Param('id') comentarioId: string,
        @Request() req: any,
        @Body('texto') texto: string,
    ) {
        const userId = req.user._id;
        return this.comentariosService.editar(comentarioId, userId, texto);
    }
}