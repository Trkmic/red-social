import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        // Asume que JwtStrategy ha adjuntado el objeto user (con perfil) a la request
        const user = request.user; 
        
        if (user && user.perfil === 'administrador') {
            return true;
        }

        throw new ForbiddenException('Solo los administradores pueden acceder a esta ruta.');
    }
}