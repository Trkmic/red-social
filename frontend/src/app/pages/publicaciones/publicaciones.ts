import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PublicacionesService, Publicacion } from '../../core/services/publicaciones.service';
import { AuthService } from '../../core/services/auth.service';
import { LimitadorCaracteresPipe } from '../../core/pipes/limitador_caracteres.pipe';
import { FormateoHoraPipe } from '../../core/pipes/formateo_hora.pipe';
import { MayusculaLetraPipe } from '../../core/pipes/mayuscula_letra.pipe';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.html',
  styleUrls: ['./publicaciones.css'],
  imports: [RouterLink,CommonModule, ReactiveFormsModule, LimitadorCaracteresPipe, FormateoHoraPipe, MayusculaLetraPipe],
  standalone: true
})

export class Publicaciones implements OnInit {
  publicaciones: Publicacion[] = [];
  formPublicacion: FormGroup;
  usuarioLogueado: any = null;
  loading = false;
  selectedFile: File | null = null;
  environment = environment;
  ordenActual: 'fecha' | 'likes' = 'fecha';
  
  userId: string | null = null; 
  isAdmin = false;

  formEditarPost: FormGroup;
  idPostEditando: string | null = null; 
  selectedFileEdit: File | null = null; 
  loadingEdit = false; 


  constructor(
    private fb: FormBuilder,
    private pubService: PublicacionesService,
    private authService: AuthService
  ) {

    this.formPublicacion = this.fb.group({
      titulo: ['', [Validators.required,Validators.maxLength(50)]],
      mensaje: ['', [Validators.required, Validators.maxLength(100)]],
      imagen: [null],
      
    });

    this.formEditarPost = this.fb.group({
      titulo: ['', Validators.required],
      mensaje: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.usuarioLogueado = this.authService.getUsuarioLogueado();
      this.userId = this.usuarioLogueado?._id || this.usuarioLogueado?.id;
      
      if (this.usuarioLogueado.nombreUsuario === 'pedrooo10') {
        this.isAdmin = true;
      }

      this.cargarPublicaciones();
    }, 100); 

  }


  cargarPublicaciones(): void {
    this.pubService.obtenerPublicaciones(this.ordenActual).subscribe({
      next: (data) => {
        this.publicaciones = data.map(post => ({
          ...post,
          likes: post.likes?.map(l => l.toString()) || []
        }));
      },
    });
  }

  cambiarOrden(nuevoOrden: 'fecha' | 'likes'): void {
    if (this.ordenActual === nuevoOrden) return; 
    this.ordenActual = nuevoOrden;
    this.cargarPublicaciones();
  }


  toggleLike(pub: Publicacion) {
    if (!this.userId) {
      return;
    }
  
    const index = this.publicaciones.findIndex(p => p._id === pub._id);
    if (index === -1) return;
  
    const liked = this.publicaciones[index].likes.includes(this.userId);
    let obs;
  
    if (liked) {

      this.publicaciones[index].likes = this.publicaciones[index].likes.filter(id => id !== this.userId);
      obs = this.pubService.quitarLike(pub._id, this.userId);

    } else {

      this.publicaciones[index].likes.push(this.userId);
      obs = this.pubService.darLike(pub._id, this.userId);
    }
  
    obs.subscribe({
      next: (backendPub) => {
        this.publicaciones[index] = {
          ...backendPub,
          likes: backendPub.likes?.map(l => l.toString()) || []
        };
      },
      error: (err) => {
        this.cargarPublicaciones(); 
      }
    });
  }

  yaLeDioLike(pub: Publicacion): boolean {
    if (!this.userId) {
      return false;
    }
  
    return pub.likes?.map(l => l.toString()).includes(this.userId) || false;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

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
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        this.cargarPublicaciones();
      },

      error: () => this.loading = false
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
            Swal.fire('Eliminada', 'La publicación fue eliminada con éxito.', 'success');
          },
          error: (err) => {
            Swal.fire('Error', 'Ocurrió un problema al eliminar la publicación.', 'error');
          }
        });
      }
    });
  }

  onFileChangeEdit(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFileEdit = file;
    }
  }

  editarPublicacion(pub: Publicacion): void {
    this.idPostEditando = pub._id; 
    this.selectedFileEdit = null; 
    
    this.formEditarPost.patchValue({
      titulo: pub.titulo,
      mensaje: pub.mensaje
    });
  }

  cancelarEdicion(): void {
    this.idPostEditando = null;
    this.selectedFileEdit = null;
  }

  guardarEdicionPost(): void {
    if (!this.idPostEditando || this.formEditarPost.invalid) {
      return;
    }
    this.loadingEdit = true;

    const data = this.formEditarPost.value; 

    this.pubService.actualizarPublicacion(this.idPostEditando, data, this.selectedFileEdit).subscribe({
      next: () => {
        this.loadingEdit = false;
        this.idPostEditando = null; 
        this.selectedFileEdit = null;
        this.cargarPublicaciones();
        Swal.fire('¡Actualizado!', 'Publicación modificada.', 'success');
      },
      error: (err) => {
        this.loadingEdit = false;
        Swal.fire('Error', 'No se pudo actualizar la publicación.', 'error');
      }
    });
  }

}