import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadImage(file: Express.Multer.File, folder: string = 'usuarios'): Promise<string> {
        try {
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error?: any, result?: UploadApiResponse) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('Sin resultados de Cloudinary'));
                resolve(result);
            }
            );

            const stream = Readable.from(file.buffer);
            stream.pipe(uploadStream);
        });

        return result.secure_url;
        } catch (err) {
        console.error(err);
        throw new InternalServerErrorException('Error al subir la imagen a Cloudinary');
        }
    }
}
