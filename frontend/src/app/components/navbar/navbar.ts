import { Component } from '@angular/core';
import { Router , NavigationEnd} from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {
    // Escuchar cambios de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;

        // Resetear botones
        this.showPublicaciones = false;
        this.showMiPerfil = false;
        this.showSalir = false;

        // Mostrar botones según página
        if (url.includes('/publicaciones')) {
          this.showMiPerfil = true;
          this.showSalir = true;
        } else if (url.includes('/mi-perfil')) {
          this.showPublicaciones = true;
          this.showSalir = true;
        }
        // login y registro quedan sin botones
      }
    });
  }

  navegador(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}