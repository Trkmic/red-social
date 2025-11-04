import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidarTamanioImagenMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const file = req.file; // multer agrega file al request

        if (file) {
        const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
        if (file.size > maxSizeInBytes) {
            throw new BadRequestException(
            'La imagen excede el tamaño máximo permitido (2 MB).'
            );
        }
        }

        next();
    }
}