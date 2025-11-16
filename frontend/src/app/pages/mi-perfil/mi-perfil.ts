import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
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
  imports: [CommonModule, DatePipe, ReactiveFormsModule], 
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css'],
})
export class MiPerfil implements OnInit {
  usuario: {
    _id: string;
    nombreUsuario: string;
    nombre?: string; 
    apellido?: string; 
    fechaNacimiento?: string; 
    descripcion?: string;
    imagenPerfil?: string;
  } | null = null;

  publicaciones: PublicacionPoblada[] = [];

  formPerfil: FormGroup;
  editando = false;
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private publicacionesService: PublicacionesService,
    private fb: FormBuilder 
  ) {
    
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
          nombre: userFromServer.nombre, 
          apellido: userFromServer.apellido, 
          fechaNacimiento: userFromServer.fechaNacimiento, 
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

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  guardarPerfil(): void {
    if (this.formPerfil.invalid) {
      return;
    }
    if (!this.usuario) return;

    const data = this.formPerfil.value;

    this.authService.actualizarUsuario(this.usuario._id, data, this.selectedFile).subscribe({
      next: (usuarioActualizado) => {
        this.usuario = { ...this.usuario, ...usuarioActualizado }; 
        this.editando = false;
        this.selectedFile = null;
        Swal.fire('¡Éxito!', 'Tu perfil ha sido actualizado.', 'success');
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.selectedFile = null; 
    if (this.usuario) {
      this.formPerfil.patchValue(this.usuario);
    }
  }
}
