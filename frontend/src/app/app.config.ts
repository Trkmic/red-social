import { ApplicationConfig, isDevMode } from '@angular/core'; // 🆕 Importar isDevMode
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { provideServiceWorker } from '@angular/service-worker'; // 🆕 Importar provideServiceWorker

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    // 🆕 Registro del Service Worker
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(), // Habilitar solo en producción
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};