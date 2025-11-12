import { Controller, Get, Post, Body, Delete, Param, Query,UseInterceptors, UploadedFile} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones')
    export class PublicacionesController {
        constructor(private readonly publicacionesService: PublicacionesService) {}
    
        @Post()
        @UseInterceptors(FileInterceptor('imagen', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                callback(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }))
        async crear(@UploadedFile() file: Express.Multer.File, @Body() data: any) {
            if (file) data.imagen = `/uploads/${file.filename}`;
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
        async eliminar(
            @Param('id') id: string,
            @Query('userId') userId: string
        ) {
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