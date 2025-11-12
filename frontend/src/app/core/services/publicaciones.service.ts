import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface Publicacion {
    _id: string;
    titulo: string;
    mensaje: string;
    imagen?: string | null;
    usuarioId: { _id: string; username: string };
    likes: string[];
    createdAt: string;
    comentarios?: { texto: string; usuario: string }[];
}

@Injectable({
    providedIn: 'root'
})
export class PublicacionesService {
    private baseUrl = `${environment.apiUrl}/publicaciones`;

    constructor(private http: HttpClient, private authService: AuthService) {}

    obtenerPublicaciones(
        orden: 'fecha' | 'likes' = 'fecha',
        offset = 0,
        limit = 10
    ): Observable<Publicacion[]> {
        return this.http.get<Publicacion[]>(
        `${this.baseUrl}?orden=${orden}&offset=${offset}&limit=${limit}`
        );
    }

    getPublicacionesUsuario(userId: string, limit: number = 3): Observable<Publicacion[]> {
        return this.http.get<Publicacion[]>(
        `${this.baseUrl}?usuario=${userId}&limit=${limit}&orden=fecha`
        );
    }

    getUsuario(id: string): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/usuarios/${id}`);
    }

    crearPublicacion(data: FormData): Observable<Publicacion> {
        const user = this.authService.getUsuarioLogueado();
        if (!user) return throwError(() => new Error('Usuario no logueado'));

        const userId = user._id || user.id; 
        data.append('usuarioId', userId);

        console.log('📤 Creando publicación con usuarioId:', userId);

        return this.http.post<Publicacion>(this.baseUrl, data);
    }

    darLike(id: string): Observable<Publicacion> {
        const user = this.authService.getUsuarioLogueado();
        if (!user?._id) return throwError(() => new Error('Usuario no logueado'));
        return this.http.post<Publicacion>(`${this.baseUrl}/${id}/like`, { userId: user._id });
    }

    quitarLike(id: string): Observable<Publicacion> {
        const user = this.authService.getUsuarioLogueado();
        if (!user?._id) return throwError(() => new Error('Usuario no logueado'));
        return this.http.delete<Publicacion>(`${this.baseUrl}/${id}/like?userId=${user._id}`);
    }

    eliminarPublicacion(id: string): Observable<any> {
        const user = this.authService.getUsuarioLogueado();
        if (!user) return throwError(() => new Error('Usuario no logueado'));

        const userId = user._id || user.id;
        return this.http.delete(`${this.baseUrl}/${id}?userId=${userId}`);
    }
}
