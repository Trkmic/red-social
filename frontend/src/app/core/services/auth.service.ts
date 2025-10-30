import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://localhost:3000/auth';

    constructor(private http: HttpClient) {}

    login(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/login`, data).pipe(
            tap((res: any) => {
                // Guardamos token
                localStorage.setItem('token', res.token);
                // Guardamos usuario completo
                localStorage.setItem('usuario', JSON.stringify(res.usuario));
            })
        );
    }

    register(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/register`, data);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    // Nuevo método para obtener usuario logueado
    getUsuarioLogueado(): any {
        const user = localStorage.getItem('usuario');
        if (!user) return null;
        
        try {
            return JSON.parse(user);
        } catch (e) {
            console.error('Error al parsear el usuario desde localStorage', e);
            localStorage.removeItem('usuario'); // opcional: limpiar si está corrupto
            return null;
        }
    }
}
