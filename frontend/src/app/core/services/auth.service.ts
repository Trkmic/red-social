import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { Observable, of, Subscription, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; 

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = environment.apiUrl;
  private sessionWarningTimer?: Subscription;
  private sessionLogoutTimer?: Subscription;

  constructor(private http: HttpClient, 
    private router: Router
  ) 
  {}

  register(formData: FormData) {
    return this.http.post(`${this.baseUrl}/auth/register`, formData);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data).pipe(
      tap((res: any) => {
        if (res.token && res.user) { // Asegurarse de que user exista
          const usuario = res.user;
          // Normalizar el ID
          if (usuario.id && !usuario._id) {
            usuario._id = usuario.id;
          }
          localStorage.setItem('token', res.token);
          localStorage.setItem('usuario', JSON.stringify(usuario));
        
          this.startSessionTimers();
        }
      })
    );
  }

  logout(showModal = true) { // Opcional: para no mostrar modal en hard-logout
    // 5. Detiene los temporizadores al hacer logout
    this.stopSessionTimers(); 
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    if (showModal) {
      this.router.navigate(['/login']);
    } else {
      // Si es un hard-logout, avisamos
      this.router.navigate(['/login']);
      Swal.fire('Sesión Expirada', 'Tu sesión ha finalizado.', 'info');
    }
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

  actualizarUsuario(id: string, data: any, file: File | null): Observable<any> {
    
    // 2. Crear FormData
    const formData = new FormData();

    // 3. Adjuntar todos los datos de texto (del formulario)
    formData.append('nombre', data.nombre || '');
    formData.append('apellido', data.apellido || '');
    formData.append('descripcion', data.descripcion || '');
    // ... (puedes añadir más campos si los tienes)

    // 4. Adjuntar el archivo si existe
    if (file) {
      formData.append('imagenPerfil', file, file.name);
    }

    // 5. Enviar FormData. Angular pondrá el 'Content-Type' correcto.
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, formData).pipe(
      tap((usuarioActualizado: any) => {
        // ... (lógica de 'tap' sin cambios para actualizar localStorage)
        if (usuarioActualizado.id && !usuarioActualizado._id) {
          usuarioActualizado._id = usuarioActualizado.id;
        }
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      })
    );
  }

  checkTokenValidity(): Observable<boolean> {
    const token = this.getToken();
    const user = this.getUsuarioLogueado();

    // Si no hay token o usuario, no es válido
    if (!token || !user?.id) {
      this.logout(); // Asegurarse de limpiar localStorage
      return of(false);
    }

    // Llamamos a getUsuarioPorId.
    // El interceptor adjuntará el token.
    // Si el token es inválido, el backend (eventualmente) debería devolver un 401.
    return this.getUsuarioPorId(user.id).pipe(
      tap((usuarioActualizado: any) => {
        // Si el token es VÁLIDO y trae al usuario,
        // actualizamos el usuario en localStorage (refrescar datos).
        if (usuarioActualizado.id && !usuarioActualizado._id) {
          usuarioActualizado._id = usuarioActualizado.id;
        }
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      }),
      map(() => true), // Si la petición tuvo éxito, el token es válido
      catchError((error) => {
        // Si la petición falla (401, 403, 404), el token es inválido
        console.error('Error de validación de token:', error);
        this.logout(); // Limpiamos el token inválido
        return of(false); // Devolvemos 'false'
      })
    );
  }

  startSessionTimers() {
    this.stopSessionTimers(); // Limpia timers anteriores

    const t = 1000 * 60; // 1 minuto

    // Temporizador de 10 minutos para el AVISO
    this.sessionWarningTimer = timer(10 * t).subscribe(() => {
      this.showExtensionModal();
    });

    // Temporizador de 15 minutos para DESLOGUEO FORZADO
    // (Tu token vence a los 15 min)
    this.sessionLogoutTimer = timer(15 * t).subscribe(() => {
      console.log('15 min pasaron. Deslogueo forzado.');
      this.logout(false); // Llama a logout sin modal de "ya te deslogueaste"
    });
  }

  /**
   * Detiene y limpia los temporizadores activos.
   */
  stopSessionTimers() {
    this.sessionWarningTimer?.unsubscribe();
    this.sessionLogoutTimer?.unsubscribe();
  }

  /**
   * Muestra el modal de SweetAlert preguntando si extender la sesión.
   */
  showExtensionModal() {
    Swal.fire({
      title: 'Tu sesión está por expirar',
      text: 'Quedan 5 minutos. ¿Deseas extender tu sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, extender',
      cancelButtonText: 'No, salir'
    }).then((result) => {
      if (result.isConfirmed) {
        // El usuario quiere extender
        this.refreshToken().subscribe();
      } else {
        // El usuario no quiere extender (o cerró el modal)
        this.logout();
      }
    });
  }

  /**
   * Llama al (aún inexistente) endpoint de refresh.
   */
  refreshToken(): Observable<any> {
    // ¡¡ADVERTENCIA!!
    // Esta llamada fallará con un 404 (Not Found)
    // porque tu backend no tiene la ruta '/auth/refresh'.
    
    // Asumimos que el endpoint solo necesita el token actual (que va en el interceptor)
    return this.http.post(`${this.baseUrl}/auth/refresh`, {}).pipe(
      tap((res: any) => {
        if (res.token) {
          // Si el backend responde con un nuevo token, lo guardamos
          localStorage.setItem('token', res.token);
          // Y reiniciamos los contadores
          this.startSessionTimers();
          console.log('Token refrescado!');
        }
      }),
      catchError((err) => {
        // Si el refresh falla (ej. 401 o 404), deslogueamos al usuario.
        console.error('Error al refrescar token:', err);
        this.logout();
        return of(null);
      })
    );
  }
}

