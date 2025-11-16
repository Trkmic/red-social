import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse, } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs'; 
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  // Auth y el token
    const authService = inject(AuthService);
    const token = authService.getToken();

    const isApiUrl = req.url.startsWith(environment.apiUrl);

    // tenemos token y es una petición 
    if (token && isApiUrl) {
        // autorizamos
        req = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
        });
    }

    return next(req).pipe(
        catchError((error: any) => {
          // Verificamos 
            if (error instanceof HttpErrorResponse) {
                
                if (error.status === 401) {
                  authService.logout(); 
                }
            }
    
            return throwError(() => error);
        })
    );
};