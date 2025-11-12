import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PublicacionesService, Publicacion } from '../../core/services/publicaciones.service';
import { AuthService } from '../../core/services/auth.service';
import { LimitadorCaracteresPipe } from '../../core/pipes/limitador_caracteres.pipe';
import { FormateoHoraPipe } from '../../core/pipes/formateo_hora.pipe';
import { MayusculaLetraPipe } from '../../core/pipes/mayuscula_letra.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.html',
  styleUrls: ['./publicaciones.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LimitadorCaracteresPipe,
    FormateoHoraPipe,
    MayusculaLetraPipe
  ],
  standalone: true
})
export class Publicaciones implements OnInit {
  publicaciones: Publicacion[] = [];
  formPublicacion: FormGroup;
  usuarioLogueado: any = null;
  loading = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private pubService: PublicacionesService,
    private authService: AuthService
  ) {
    this.formPublicacion = this.fb.group({
      titulo: ['', Validators.required],
      mensaje: ['', Validators.required],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.usuarioLogueado = this.authService.getUsuarioLogueado();
    if (!this.usuarioLogueado) {
      window.location.href = '/login';
      return;
    }
    this.cargarPublicaciones();
  }

  /** 🔹 Cargar publicaciones */
  cargarPublicaciones(): void {
    this.pubService.obtenerPublicaciones().subscribe({
      next: (data) => {
        // Convertir todos los likes a strings
        this.publicaciones = data.map(post => ({
          ...post,
          likes: post.likes?.map(l => l.toString()) || []
        }));
      },
    });
  }

  /** 🔹 Like / Unlike */
  toggleLike(pub: Publicacion) {
    if (!this.usuarioLogueado?._id) return;
  
    const liked = pub.likes?.map(l => l.toString()).includes(this.usuarioLogueado._id);
    const obs = liked ? this.pubService.quitarLike(pub._id) : this.pubService.darLike(pub._id);
  
    obs.subscribe({
      next: updatedPub => {
        const index = this.publicaciones.findIndex(p => p._id === updatedPub._id);
        if (index !== -1) this.publicaciones[index] = updatedPub;
      },
    });
  }
  
  /** Helper para ngClass */
  yaLeDioLike(pub: Publicacion): boolean {
    return pub.likes?.map(l => l.toString()).includes(this.usuarioLogueado?._id) || false;
  }

  /** 🔹 Subir imagen */
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  /** 🔹 Crear publicación */
  crearPublicacion(): void {
    if (this.formPublicacion.invalid) return;
    this.loading = true;

    const formData = new FormData();
    formData.append('titulo', this.formPublicacion.get('titulo')?.value);
    formData.append('mensaje', this.formPublicacion.get('mensaje')?.value);
    if (this.selectedFile) formData.append('imagen', this.selectedFile);

    this.pubService.crearPublicacion(formData).subscribe({
      next: () => {
        this.loading = false;
        this.formPublicacion.reset();
        this.selectedFile = null;
        this.cargarPublicaciones();
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  eliminarPublicacion(id: string): void {
    Swal.fire({
      title: '¿Seguro que deseas eliminar esta publicación?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pubService.eliminarPublicacion(id).subscribe({
          next: () => {
            this.cargarPublicaciones();
            Swal.fire({
              title: 'Eliminada',
              text: 'La publicación fue eliminada con éxito.',
              icon: 'success',
              confirmButtonColor: '#3085d6'
            });
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un problema al eliminar la publicación.',
              icon: 'error',
              confirmButtonColor: '#3085d6'
            });
          }
        });
      }
    });
  }
}

