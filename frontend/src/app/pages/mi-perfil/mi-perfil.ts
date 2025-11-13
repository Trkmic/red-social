import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // 1. IMPORTAR DatePipe
import { AuthService } from '../../core/services/auth.service';
import {PublicacionesService,Publicacion} from '../../core/services/publicaciones.service';
import { Types } from 'mongoose';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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
  imports: [CommonModule, DatePipe, ReactiveFormsModule], // 2. AÑADIR DatePipe a los imports
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css'],
})
export class MiPerfil implements OnInit {
  usuario: {
    _id: string;
    nombreUsuario: string;
    nombre?: string; // 3. AÑADIDO
    apellido?: string; // 4. AÑADIDO
    fechaNacimiento?: string; // 5. AÑADIDO
    descripcion?: string;
    imagenPerfil?: string;
  } | null = null;

  publicaciones: PublicacionPoblada[] = [];

  formPerfil: FormGroup;
  editando = false;

  constructor(
    private authService: AuthService,
    private publicacionesService: PublicacionesService,
    private fb: FormBuilder 
  ) {
    
    // === 6. INICIALIZAR EL FORMULARIO ===
    this.formPerfil = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      descripcion: [''],
    });
  }

  ngOnInit(): void {
    const storedUser = this.authService.getUsuarioLogueado();
    if (!storedUser?.id) {
      window.location.href = '/login';
      return;
    }

    this.authService.getUsuarioPorId(storedUser.id).subscribe({
      next: (userFromServer: any) => {
        this.usuario = {
          _id: userFromServer._id,
          nombreUsuario: userFromServer.nombreUsuario,
          descripcion: userFromServer.descripcion,
          imagenPerfil: userFromServer.imagenPerfil,
          nombre: userFromServer.nombre, // 6. AÑADIDO
          apellido: userFromServer.apellido, // 7. AÑADIDO
          fechaNacimiento: userFromServer.fechaNacimiento, // 8. AÑADIDO
        };

        this.formPerfil.patchValue({
          nombre: this.usuario.nombre || '',
          apellido: this.usuario.apellido || '',
          descripcion: this.usuario.descripcion || ''
        });
      },
      error: (err: any) => console.error('Error al cargar usuario:', err),
    });

    const userId = storedUser._id || storedUser.id;
    console.log('🧍 ID del usuario logueado:', userId);
    this.publicacionesService.getPublicacionesUsuario(userId, 3).subscribe({
      next: (res: Publicacion[]) => {
        this.publicaciones = res.map((pub) => ({
          _id: pub._id,
          titulo: pub.titulo,
          mensaje: pub.mensaje,
          imagen: pub.imagen || null,
          likes: pub.likes?.map((l: string | Types.ObjectId) => l.toString()) || [],
          usuarioId: {
            _id: (pub.usuarioId as any)._id,
            nombreUsuario:
              (pub.usuarioId as any).nombreUsuario ||
              (pub.usuarioId as any).username,
            imagenPerfil: (pub.usuarioId as any).imagenPerfil,
          },
          createdAt: pub.createdAt,
          comentarios: pub.comentarios || [],
        }));
      },
      error: (err: any) => console.error('Error al cargar publicaciones:', err),
    });
  }

  guardarPerfil(): void {
    if (this.formPerfil.invalid) {
      Swal.fire('Error', 'Nombre y Apellido son obligatorios.', 'error');
      return;
    }

    if (!this.usuario) return;

    const data = this.formPerfil.value;

    this.authService.actualizarUsuario(this.usuario._id, data).subscribe({
      next: (usuarioActualizado) => {
        // Actualizamos el objeto 'usuario' local con los nuevos datos
        this.usuario = { ...this.usuario, ...usuarioActualizado }; 
        this.editando = false; // Salimos del modo edición
        Swal.fire('¡Éxito!', 'Tu perfil ha sido actualizado.', 'success');
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        Swal.fire('Error', 'No se pudo actualizar el perfil.', 'error');
      }
    });
  }

  // === 9. AÑADIR MÉTODO PARA CANCELAR ===
  cancelarEdicion(): void {
    this.editando = false;
    // Reseteamos el formulario a los valores originales del usuario
    if (this.usuario) {
      this.formPerfil.patchValue(this.usuario);
    }
  }
}