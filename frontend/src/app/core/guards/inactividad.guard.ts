import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class InactivdadGuard implements CanActivate, OnDestroy {
    private inactivitySub?: Subscription;

    constructor(private auth: AuthService, private router: Router) {}

    canActivate(): boolean {
        const rutasProtegidas = ['/publicaciones', '/mi-perfil'];

        if (!rutasProtegidas.includes(this.router.url)) {
            return true; 
        }

        const activityEvents = merge(
            fromEvent(document, 'mousemove'),
            fromEvent(document, 'mousedown'),
            fromEvent(document, 'keypress'),
            fromEvent(document, 'touchstart')
        );

        this.inactivitySub = activityEvents.pipe(
            switchMap(() => timer(2 * 60 * 1000)) // 2 minutos
        ).subscribe(async () => {
            await Swal.fire({
                icon: 'warning',
                title: 'Sesión expirada',
                text: 'Tu sesión ha expirado por inactividad.',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            this.auth.logout();
            this.router.navigate(['/login']);
        });

        return true;
    }

    ngOnDestroy() {
        this.inactivitySub?.unsubscribe();
    }
}