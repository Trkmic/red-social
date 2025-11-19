import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { cloudinaryConfig } from './cloudinary.config'; // Asumiendo que usa esta configuración

@Module({
    providers: [cloudinaryConfig, CloudinaryService],
    exports: [CloudinaryService], // Exportamos el servicio para que otros módulos puedan usarlo
})
export class CloudinaryModule {}