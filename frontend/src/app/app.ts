import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { AuthService } from './core/services/auth.service'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-root',
  imports: [CommonModule,RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('red-social');

  isLoading = true; // Controla la pantalla de carga
  private authService = inject(AuthService);
  private router = inject(Router);

  // 8. IMPLEMENTAR ngOnInit
  ngOnInit(): void {
    // Al iniciar el componente, validamos el token
    this.authService.checkTokenValidity().subscribe((isValid) => {
      // 9. Cuando la validación termina, ocultamos el spinner
      this.isLoading = false;

      // 10. Redirigimos según el resultado
      if (isValid) {
        this.router.navigate(['/publicaciones']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
