import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 👈 Importación requerida para la inyección
import { CloudinaryService } from './cloudinary.service';
import { cloudinaryConfig } from './cloudinary.config'; 

// 💡 Definimos un token de inyección para la instancia de Cloudinary
export const CLOUDINARY_PROVIDER = 'CLOUDINARY_PROVIDER';

@Module({
    // 1. Importamos ConfigModule para poder inyectar ConfigService
    imports: [ConfigModule], 
    providers: [
        {
            // 2. Corregimos el error usando un Factory Provider:
            provide: CLOUDINARY_PROVIDER,
            useFactory: cloudinaryConfig, // Usamos la función de configuración
            inject: [ConfigService],     // Inyectamos la dependencia ConfigService
        },
        CloudinaryService
    ],
    // 3. Exportamos el proveedor y el servicio
    exports: [CloudinaryService, CLOUDINARY_PROVIDER], 
})
export class CloudinaryModule {}