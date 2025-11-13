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
    usuarioId: {
        _id: string;
        nombreUsuario: string;
        imagenPerfil?: string;
    };
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
            `${this.baseUrl}/usuario/${userId}?limit=${limit}&orden=fecha`
        );
    }


    crearPublicacion(data: FormData): Observable<Publicacion> {
        const user = this.authService.getUsuarioLogueado();
        if (!user) return throwError(() => new Error('Usuario no logueado'));

        const userId = user._id || user.id; 
        data.append('usuarioId', userId);

        console.log('📤 Creando publicación con usuarioId:', userId);

        return this.http.post<Publicacion>(this.baseUrl, data);
    }

    // ✅ MODIFICADO: Aceptar 'userId' como argumento
    darLike(id: string, userId: string): Observable<Publicacion> {
        // Ya no buscamos al usuario aquí, confiamos en el argumento
        if (!userId) return throwError(() => new Error('No se proveyó userId para dar like'));
        return this.http.post<Publicacion>(`${this.baseUrl}/${id}/like`, { userId: userId });
    }

    // ✅ MODIFICADO: Aceptar 'userId' como argumento
    quitarLike(id: string, userId: string): Observable<Publicacion> {
        // Ya no buscamos al usuario aquí, confiamos en el argumento
        if (!userId) return throwError(() => new Error('No se proveyó userId para quitar like'));
        return this.http.delete<Publicacion>(`${this.baseUrl}/${id}/like?userId=${userId}`);
    }

    eliminarPublicacion(id: string): Observable<any> {
        const user = this.authService.getUsuarioLogueado();
        if (!user) return throwError(() => new Error('Usuario no logueado'));

        const userId = user._id || user.id;
        return this.http.delete(`${this.baseUrl}/${id}?userId=${userId}`);
    }


    actualizarPublicacion(id: string, data: { titulo: string; mensaje: string }): Observable<Publicacion> {
        const user = this.authService.getUsuarioLogueado();
        if (!user) return throwError(() => new Error('Usuario no logueado'));
        
        const body = { ...data, userId: user._id || user.id };
        
        return this.http.put<Publicacion>(`${this.baseUrl}/${id}`, body);
    }
}