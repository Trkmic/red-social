import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(formData: FormData) {
    return this.http.post(`${this.baseUrl}/auth/register`, formData);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('usuario', JSON.stringify(res.user));
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login'; 
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }

  getUsuarioLogueado(): any {
    const user = localStorage.getItem('usuario');
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem('usuario');
      return null;
    }
  }

  getUsuarioPorId(id: string) {
    return this.http.get(`${this.baseUrl}/usuarios/${id}`);
  }

  actualizarUsuario(id: string, data: any): Observable<any> {
    // Usamos PUT para reemplazar/actualizar los datos del usuario
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, data).pipe(
      tap((usuarioActualizado: any) => {
        // IMPORTANTE: Actualizar el usuario en localStorage
        // para que los cambios se reflejen en toda la app
        
        // Primero, normalizamos el ID (por si acaso el backend solo devuelve 'id')
        if (usuarioActualizado.id && !usuarioActualizado._id) {
          usuarioActualizado._id = usuarioActualizado.id;
        }

        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      })
    );
  }
}
