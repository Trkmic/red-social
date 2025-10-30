import { Controller, Get, Post, Body, Delete, Param, Query } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones')
export class PublicacionesController {
    constructor(private readonly publicacionesService: PublicacionesService) {}

    @Post()
    crear(@Body() data: any) {
        return this.publicacionesService.crear(data);
    }

    @Get()
    obtenerTodas(
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
        @Query('orden') orden?: 'fecha' | 'likes',
    ) {
        return this.publicacionesService.obtenerTodas({ limit, offset, orden });
    }

    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.publicacionesService.eliminar(id);
    }

    @Post(':id/like')
    darLike(@Param('id') id: string, @Body('userId') userId: string) {
        return this.publicacionesService.darLike(id, userId);
    }

    @Delete(':id/like')
    quitarLike(@Param('id') id: string, @Body('userId') userId: string) {
        return this.publicacionesService.quitarLike(id, userId);
    }
}
