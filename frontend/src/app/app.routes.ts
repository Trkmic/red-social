import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { InactivdadGuard } from './core/guards/inactividad_guard';

export const routes: Routes = [
    {path: '',redirectTo: 'login',pathMatch: 'full'},
    {path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login)},
    {path: 'registro', canActivate: [InactivdadGuard],loadComponent: () => import('./pages/registro/registro').then(m => m.Registro)},
    {path: 'publicaciones', canActivate: [AuthGuard,InactivdadGuard], loadComponent: () => import('./pages/publicaciones/publicaciones').then(m => m.Publicaciones)},
    {path: 'mi-perfil', canActivate: [AuthGuard,InactivdadGuard],loadComponent: () => import('./pages/mi-perfil/mi-perfil').then(m => m.MiPerfil)},
    {path: '**', redirectTo: 'login'}
];
