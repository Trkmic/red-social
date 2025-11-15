import { Controller, Get, Post, Body, Delete, Param, Query, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PublicacionesService } from './publicaciones.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('publicaciones')
export class PublicacionesController {
    constructor(
        private readonly publicacionesService: PublicacionesService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
    async crear(@UploadedFile() file: Express.Multer.File, @Body() data: any) {
        if (file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file, 'publicaciones');
        data.imagen = imageUrl;
        }
        return this.publicacionesService.crear(data);
    }

    @Get(':id')
    async obtenerPorId(@Param('id') id: string) {
        return this.publicacionesService.obtenerPorId(id);
    }

    @Get('usuario/:id')
    async obtenerPorUsuario(
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('orden') orden?: 'fecha' | 'likes',
    ) {
    return this.publicacionesService.obtenerPorUsuario(id, { limit, orden });
    }

    @Get()
    async obtenerTodas(
        @Query('usuario') usuario?: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
        @Query('orden') orden?: 'fecha' | 'likes',
    ) {
        return this.publicacionesService.obtenerTodas({ usuario, limit, offset, orden });
    }

    @Delete(':id')
    async eliminar(@Param('id') id: string, @Query('userId') userId: string) {
        return this.publicacionesService.eliminar(id, userId);
    }

    @Post(':id/like')
    darLike(@Param('id') id: string, @Body('userId') userId: string) {
        return this.publicacionesService.darLike(id, userId);
    }

    @Delete(':id/like')
    quitarLike(@Param('id') id: string, @Query('userId') userId: string) {
        return this.publicacionesService.quitarLike(id, userId);
    }

    @Put(':id')
    async actualizar(
        @Param('id') id: string,
        @Body() data: any, // data ya incluye { titulo, mensaje, userId } desde el frontend
    ) {
        const { userId, ...updateData } = data; // Separamos el userId del resto de los datos
        // Pasamos el ID del post, el ID del usuario (para validación) y los datos a actualizar
        return this.publicacionesService.actualizar(id, userId, updateData);
    }

}