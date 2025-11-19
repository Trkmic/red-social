import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class EstadisticasService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    private createParams(fechaInicio: string, fechaFin: string): HttpParams {
        let params = new HttpParams();
        if (fechaInicio) {
        params = params.set('fechaInicio', fechaInicio);
        }
        if (fechaFin) {
        params = params.set('fechaFin', fechaFin);
        }
        return params;
    }

    getPublicacionesPorUsuario(fechaInicio: string, fechaFin: string): Observable<any> {
        const params = this.createParams(fechaInicio, fechaFin);
        return this.http.get(`${this.baseUrl}/estadisticas/publicaciones-por-usuario`, { params });
    }

    getComentariosTotales(fechaInicio: string, fechaFin: string): Observable<any> {
        const params = this.createParams(fechaInicio, fechaFin);
        return this.http.get(`${this.baseUrl}/estadisticas/comentarios-totales`, { params });
    }

    getComentariosPorPublicacion(fechaInicio: string, fechaFin: string): Observable<any> {
        const params = this.createParams(fechaInicio, fechaFin);
        return this.http.get(`${this.baseUrl}/estadisticas/comentarios-por-publicacion`, { params });
    }

    getLoginsPorUsuario(fechaInicio: string, fechaFin: string): Observable<any> {
        const params = this.createParams(fechaInicio, fechaFin);
        return this.http.get(`${this.baseUrl}/estadisticas/logins-por-usuario`, { params });
    }
    
    getVisitasPerfilPorDia(fechaInicio: string, fechaFin: string): Observable<any> {
        const params = this.createParams(fechaInicio, fechaFin);
        return this.http.get(`${this.baseUrl}/estadisticas/visitas-perfil-por-dia`, { params });
    }
    
    getLikesOtorgadosPorDia(fechaInicio: string, fechaFin: string): Observable<any> {
        const params = this.createParams(fechaInicio, fechaFin);
        return this.http.get(`${this.baseUrl}/estadisticas/likes-otorgados-por-dia`, { params });
    }
}