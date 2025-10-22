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
        tap((res: any) => localStorage.setItem('token', res.token))
        );
    }

    register(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/register`, data);
    }

    logout() {
        localStorage.removeItem('token');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}