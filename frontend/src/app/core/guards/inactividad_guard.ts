import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class InactivdadGuard implements CanActivate {
    private inactivitySub?: Subscription;

    constructor(private auth: AuthService, private router: Router) {}

    canActivate(): boolean {
        // Observables de eventos de usuario
        const activityEvents = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'mousedown'),
        fromEvent(document, 'keypress'),
        fromEvent(document, 'touchstart')
        );

        // Cada vez que hay actividad, resetea el timer
        this.inactivitySub = activityEvents.pipe(
        switchMap(() => timer(2 * 60 * 1000)) // 2 minutos
        ).subscribe(() => {
        alert('Sesión expirada por inactividad.');
        this.auth.logout(); // Limpiar token / estado de login
        this.router.navigate(['/login']);
        });

        return true;
    }

    ngOnDestroy() {
        this.inactivitySub?.unsubscribe();
    }
}
