import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/auth';

    constructor(private http: HttpClient) {}

    register(formData: FormData) {
        return this.http.post(`${this.apiUrl}/register`, formData);
    }

    login(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, data).pipe(
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
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
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
}