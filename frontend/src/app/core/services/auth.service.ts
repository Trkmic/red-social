import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of, Subscription, timer, interval } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; 
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = environment.apiUrl;
  private sessionWarningTimer?: Subscription;
  private sessionLogoutTimer?: Subscription;
  
  private sessionProactiveCheckSubscription: Subscription | null = null;
  private readonly PROACTIVE_CHECK_INTERVAL = 300000;



  constructor(private http: HttpClient, 
    private router: Router
  )
    {
      // 💡 Si hay un token, iniciamos el chequeo proactivo
      if (this.getToken()) {
          this.startProactiveCheck();
      }
    }

  register(formData: FormData) {
    return this.http.post(`${this.baseUrl}/auth/register`, formData);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data).pipe(
      tap((res: any) => {
        if (res.token && res.user) { 
          const usuario = res.user;
          if (usuario.id && !usuario._id) {
            usuario._id = usuario.id;
          }
          localStorage.setItem('token', res.token);
          localStorage.setItem('usuario', JSON.stringify(usuario));
        
          // 🟢 INICIAR LA COMPROBACIÓN PROACTIVA
          this.startProactiveCheck();
          // ⚠️ Mantener startSessionTimers() si quieres la advertencia visual.
          this.startSessionTimers(); 
        }
      })
    );
  }

  logout(showModal = true) { 
    // 🔴 DETENER TODOS LOS TIMERS
    this.stopSessionTimers(); 
    this.stopProactiveCheck(); // 🆕 DETENER EL CHEQUEO PROACTIVO
    
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    // ⚠️ Lógica de Modal (para expiración o cierre manual)
    if (showModal) {
        Swal.fire({
            title: 'Sesión Expirada', // Usamos este título para el logout manual y el expirado
            text: 'Tu sesión ha caducado. Por favor, vuelve a iniciar sesión.', 
            icon: 'warning',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
        }).then(() => {
            this.router.navigate(['/login']);
        });
    } else {
        // Navegación directa (usado por el Interceptor si ya mostró el modal)
        this.router.navigate(['/login']);
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
    
    const formData = new FormData();

    formData.append('nombre', data.nombre || '');
    formData.append('apellido', data.apellido || '');
    formData.append('descripcion', data.descripcion || '');

    if (file) {
      formData.append('imagenPerfil', file, file.name);
    }

    return this.http.put(`${this.baseUrl}/usuarios/${id}`, formData).pipe(
      tap((usuarioActualizado: any) => {

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
    const userId = user?._id || user?.id;

    if (!token || !userId) {
      this.logout();
      return of(false);
    }

    return this.getUsuarioPorId(userId).pipe(
      tap((usuarioActualizado: any) => {

        if (usuarioActualizado.id && !usuarioActualizado._id) {
          usuarioActualizado._id = usuarioActualizado.id;
        }

        const usuarioViejo = this.getUsuarioLogueado() || {}; 

        const usuarioFinal = {
          ...usuarioViejo,
          ...usuarioActualizado
        };

        localStorage.setItem('usuario', JSON.stringify(usuarioFinal));
      }),
      map(() => true), 
      catchError((error) => {

        this.logout(); 
        return of(false); 
      })
    );
  }

  startSessionTimers() {
    this.stopSessionTimers();

    const t = 1000 * 60; 

    this.sessionWarningTimer = timer(10 * t).subscribe(() => {
      this.showExtensionModal();
    });

    this.sessionLogoutTimer = timer(15 * t).subscribe(() => {
      this.logout(false); 
    });
  }

  stopSessionTimers() {
    this.sessionWarningTimer?.unsubscribe();
    this.sessionLogoutTimer?.unsubscribe();
  }

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
        this.refreshToken().subscribe();
      } else {
        this.logout();
      }
    });
  }

  refreshToken(): Observable<any> {

    return this.http.post(`${this.baseUrl}/auth/refresh`, {}).pipe(
      tap((res: any) => {
        if (res.token) {

          localStorage.setItem('token', res.token);
          this.startSessionTimers();
        }
      }),
      catchError((err) => {
        this.logout();
        return of(null);
      })
    );
  }

  public esAdministrador(): boolean {
    const token = this.getToken();
    if (!token) {
        return false;
    }

    try {
        // Decodifica el token para obtener el payload
        const payload: any = jwtDecode(token);
        
        // Verifica el campo 'perfil' que añadimos en el backend
        return payload.perfil === 'administrador';
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return false;
    }
  }

  startProactiveCheck(): void {
    this.stopProactiveCheck(); // Limpiar chequeo anterior

    this.sessionProactiveCheckSubscription = interval(this.PROACTIVE_CHECK_INTERVAL)
      .pipe(
        // Llamamos al endpoint de refresh. Si el token falla, el Interceptor capturará el 401.
        switchMap(() => this.http.post<any>(`${this.baseUrl}/auth/refresh`, {})
          .pipe(
            // Capturamos errores de red/server que no sean 401
            catchError(error => {
                // El error 401 es manejado por el Interceptor (no rompemos la cadena aquí).
                return of(null); 
            })
          )
        )
      )
      .subscribe({
          next: (res) => {
            if (res && res.token) {
                // Si el refresh fue exitoso, actualizamos el token
                localStorage.setItem('token', res.token);
            }
          },
          error: (err) => {} // Los errores 401 son manejados por el Interceptor global
      });
}

stopProactiveCheck(): void {
    if (this.sessionProactiveCheckSubscription) {
      this.sessionProactiveCheckSubscription.unsubscribe();
      this.sessionProactiveCheckSubscription = null;
    }
}
}

