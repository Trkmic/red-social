import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export interface Publicacion {
    _id: string;
    titulo: string;
    mensaje: string;
    imagen?: string;
    usuarioId: { _id: string, username: string };
    likes: string[];
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class PublicacionesService {
    private apiUrl = 'http://localhost:3000/publicaciones';

    constructor(private http: HttpClient, private authService: AuthService) {}

    obtenerPublicaciones(): Observable<Publicacion[]> {
        return this.http.get<Publicacion[]>(this.apiUrl);
    }

    crearPublicacion(data: FormData): Observable<Publicacion> {
        const user = this.authService.getUsuarioLogueado();
        if (!user) return throwError(() => new Error('Usuario no logueado'));
        data.append('usuarioId', user._id);
        return this.http.post<Publicacion>(this.apiUrl, data);
    }

    darLike(id: string): Observable<Publicacion> {
        const user = this.authService.getUsuarioLogueado();
        if (!user) return throwError(() => new Error('Usuario no logueado'));
        return this.http.post<Publicacion>(`${this.apiUrl}/${id}/like`, { userId: user._id });
    }

    quitarLike(id: string): Observable<Publicacion> {
        const user = this.authService.getUsuarioLogueado();
        if (!user) return throwError(() => new Error('Usuario no logueado'));
        return this.http.request<Publicacion>('delete', `${this.apiUrl}/${id}/like`, { body: { userId: user._id } });
    }
}
