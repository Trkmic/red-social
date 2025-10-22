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
  showAuthButtons = false;

  constructor(private router: Router) {
    // Escuchar cambios de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Si estamos en login o registro, ocultamos los botones de usuario
        this.showAuthButtons = !(event.url === '/login' || event.url === '/registro');
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
