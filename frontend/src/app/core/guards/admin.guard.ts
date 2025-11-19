import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asumiendo esta ruta

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Asume que authService tiene un método o propiedad para verificar el perfil
    if (authService.esAdministrador()) {
        return true;
    } else {
        // Redirigir si no es administrador (por ejemplo, a la página principal)
        return router.createUrlTree(['/publicaciones']); 
    }
};