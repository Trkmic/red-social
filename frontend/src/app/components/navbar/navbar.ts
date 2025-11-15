import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service'; // ← importa tu servicio

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  showPublicaciones = false;
  showMiPerfil = false;
  showSalir = false;

  constructor(private router: Router, private auth: AuthService) { 

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;

        this.showPublicaciones = false;
        this.showMiPerfil = false;
        this.showSalir = false;

        if (url.includes('/publicaciones')) {
          this.showMiPerfil = true;
          this.showSalir = true;
        } else if (url.includes('/mi-perfil')) {
          this.showPublicaciones = true;
          this.showSalir = true;
        }else if (url.startsWith('/publicacion/')) {
          this.showPublicaciones = true;
          this.showSalir = true;
      }
      }
    });
  }

  navegador(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
