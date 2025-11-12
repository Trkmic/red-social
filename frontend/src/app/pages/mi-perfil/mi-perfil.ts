import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { PublicacionesService, Publicacion } from '../../core/services/publicaciones.service';
import { Types } from 'mongoose';

interface PublicacionPoblada {
  _id: string;
  titulo: string;
  mensaje: string;
  imagen?: string | null;
  likes: string[];
  usuarioId: {
    _id: string;
    nombreUsuario: string;
    imagenPerfil?: string;
  };
  createdAt: string;
  comentarios?: { texto: string; usuario: string }[];
}

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css']
})
export class MiPerfil implements OnInit {
  usuario: {
    _id: string;
    nombreUsuario: string;
    descripcion?: string;
    imagenPerfil?: string;
  } | null = null;

  publicaciones: PublicacionPoblada[] = [];

  constructor(
    private authService: AuthService,
    private publicacionesService: PublicacionesService
  ) {}

  ngOnInit(): void {

    const storedUser = this.authService.getUsuarioLogueado();
    if (!storedUser?.id) {
      window.location.href = '/login';
      return;
    }

    this.publicacionesService.getUsuario(storedUser.id).subscribe({
      next: (userFromServer: any) => {
        this.usuario = {
          _id: userFromServer._id,
          nombreUsuario: userFromServer.nombreUsuario,
          descripcion: userFromServer.descripcion,
          imagenPerfil: userFromServer.imagenPerfil
        };
      },
      error: (err: any) => console.error('Error al cargar usuario:', err)
    });

    this.publicacionesService.getPublicacionesUsuario(storedUser.id, 3).subscribe({
      next: (res: Publicacion[]) => {
        this.publicaciones = res.map(pub => ({
          _id: pub._id,
          titulo: pub.titulo,
          mensaje: pub.mensaje,
          imagen: pub.imagen || null,
          likes: pub.likes?.map((l: string | Types.ObjectId) => l.toString()) || [],
          usuarioId: {
            _id: (pub.usuarioId as any)._id,
            nombreUsuario: (pub.usuarioId as any).nombreUsuario || (pub.usuarioId as any).username,
            imagenPerfil: (pub.usuarioId as any).imagenPerfil
          },
          createdAt: pub.createdAt,
          comentarios: pub.comentarios || []
        }));
      },
      error: (err: any) => console.error('Error al cargar publicaciones:', err)
    });
  }
}
