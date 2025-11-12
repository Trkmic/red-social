import { Controller, Get, Post, Body, Delete, Param, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
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
        // ✅ Subir la imagen a Cloudinary si existe
        if (file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file, 'publicaciones');
        data.imagen = imageUrl;
        }

        return this.publicacionesService.crear(data);
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
}