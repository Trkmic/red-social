import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    {
        path: 'login', 
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    {
        path: 'publicacion/:id',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/publicacion-detalle/publicacion-detalle').then(m => m.PublicacionDetalle)
    },
    {
        path: 'registro', 
        loadComponent: () => import('./pages/registro/registro').then(m => m.Registro)
    },
    {
        path: 'publicaciones', 
        canActivate: [AuthGuard], 
        loadComponent: () => import('./pages/publicaciones/publicaciones').then(m => m.Publicaciones)
    },
    {
        path: 'mi-perfil', 
        canActivate: [AuthGuard], 
        loadComponent: () => import('./pages/mi-perfil/mi-perfil').then(m => m.MiPerfil)
    },
    {
        path: 'dashboard/usuarios',
        canActivate: [adminGuard], 
        loadComponent: () => import('./pages/dashboard-usuarios/dashboard-usuarios').then(m => m.DashboardUsuariosComponent) 
    },
    {   
        path: '**', 
        redirectTo: '',
        pathMatch: 'full'
    }
];
