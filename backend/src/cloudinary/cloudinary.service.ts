import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    [key: string]: any;
}

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
        cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
        api_key: this.configService.get('CLOUDINARY_API_KEY'),
        api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        secure: true,
        });
    }

    async uploadImage(file: Express.Multer.File, folder = 'usuarios'): Promise<CloudinaryUploadResult> {
        return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
            if (error) return reject(error);
            resolve(result as CloudinaryUploadResult); // forzamos tipo seguro
            },
        ).end(file.buffer);
        });
    }
}