// 🛠️ En frontend/src/app/core/interceptor/auth.interceptor.ts

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router'; // 🆕 Importar Router

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const authService = inject(AuthService);
  const router = inject(Router); // 🆕 Inyectar Router
  
  const token = authService.getToken();

  const isApiUrl = req.url.includes(environment.apiUrl);
  
  if (token && isApiUrl) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // 🆕 Verificar si NO estamos ya en la ruta de login
          if (router.url !== '/login') {
             // Llama a logout. showModal será true por defecto y activará el modal (por la corrección en el AuthService)
            authService.logout(); 
          }
        }
      }
      return throwError(() => error);
    })
  );
};