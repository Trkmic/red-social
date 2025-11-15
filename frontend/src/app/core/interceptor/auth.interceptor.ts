import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse, } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs'; // 2. Importar throwError
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  // 1. Obtenemos el servicio de Auth y el token
    const authService = inject(AuthService);
    const token = authService.getToken();

    // 2. Comprobamos si la petición es a nuestra propia API
    const isApiUrl = req.url.startsWith(environment.apiUrl);

    // 3. Si tenemos token y es una petición a nuestra API...
    if (token && isApiUrl) {
        // 4. Clonamos la petición y añadimos el Header 'Authorization'
        req = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
        });
    }

    // 5. Dejamos que la petición continúe
    return next(req).pipe(
        catchError((error: any) => {
          // Verificamos si es un error HTTP
            if (error instanceof HttpErrorResponse) {
                
                // Verificamos si el error es un 401 (Unauthorized)
                if (error.status === 401) {
                console.error('Interceptor: Error 401 - Token inválido o expirado.');
                // Si es 401, llamamos a logout.
                // logout() ya se encarga de borrar el token y redirigir a /login
                authService.logout(); 
                }
            }
    
          // Re-lanzamos el error para que otros servicios puedan manejarlo
            return throwError(() => error);
        })
    );
};