import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { CloudinaryService } from './cloudinary.service';
import { cloudinaryConfig } from './cloudinary.config'; 


export const CLOUDINARY_PROVIDER = 'CLOUDINARY_PROVIDER';

@Module({
    
    imports: [ConfigModule], 
    providers: [
        {
        
            provide: CLOUDINARY_PROVIDER,
            useFactory: cloudinaryConfig,
            inject: [ConfigService],    
        },
        CloudinaryService
    ],

    exports: [CloudinaryService, CLOUDINARY_PROVIDER], 
})
export class CloudinaryModule {}