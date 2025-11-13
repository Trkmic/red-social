import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PublicacionesService, Publicacion } from '../../core/services/publicaciones.service';
import { AuthService } from '../../core/services/auth.service';
import { LimitadorCaracteresPipe } from '../../core/pipes/limitador_caracteres.pipe';
import { FormateoHoraPipe } from '../../core/pipes/formateo_hora.pipe';
import { MayusculaLetraPipe } from '../../core/pipes/mayuscula_letra.pipe';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.html',
  styleUrls: ['./publicaciones.css'],
  imports: [CommonModule, ReactiveFormsModule, LimitadorCaracteresPipe, FormateoHoraPipe, MayusculaLetraPipe
  ],
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
  
  // ✅ 1. PROPIEDAD AÑADIDA
  userId: string | null = null; 
  isAdmin = false;

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
  }

  // ✅ 2. FUNCIÓN ngOnInit REEMPLAZADA
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

  // ✅ 3. FUNCIÓN toggleLike REEMPLAZADA
  toggleLike(pub: Publicacion) {
    if (!this.userId) {
      console.error('Usuario no logueado, no se puede dar like');
      return;
    }
  
    const index = this.publicaciones.findIndex(p => p._id === pub._id);
    if (index === -1) return;
  
    const liked = this.publicaciones[index].likes.includes(this.userId);
    let obs;
  
    if (liked) {
      // Quitar like (optimista)
      this.publicaciones[index].likes = this.publicaciones[index].likes.filter(id => id !== this.userId);
      // ✅ PASAMOS EL userId
      obs = this.pubService.quitarLike(pub._id, this.userId);
      console.log('UI actualizada (like quitado). Llamando a backend...');
  
    } else {
      // Dar like (optimista)
      this.publicaciones[index].likes.push(this.userId);
      // ✅ PASAMOS EL userId
      obs = this.pubService.darLike(pub._id, this.userId);
      console.log('UI actualizada (like agregado). Llamando a backend...');
    }
  
    obs.subscribe({
      next: (backendPub) => {
        console.log('Respuesta del backend (re-sincronizando):', backendPub);
        this.publicaciones[index] = {
          ...backendPub,
          likes: backendPub.likes?.map(l => l.toString()) || []
        };
      },
      error: (err) => {
        console.error('Error del backend, revirtiendo UI', err);
        // Si falla, recargamos todo para asegurar consistencia
        this.cargarPublicaciones(); 
      }
    });
  }

  // ✅ 4. FUNCIÓN yaLeDioLike REEMPLAZADA
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
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'Ocurrió un problema al eliminar la publicación.', 'error');
          }
        });
      }
    });
  }

  editarPublicacion(pub: Publicacion): void {
    Swal.fire({
      title: 'Editar Publicación',
      // Usamos HTML para crear un mini-formulario dentro del pop-up
      html: `
        <input id="swal-titulo" class="swal2-input" placeholder="Título" value="${pub.titulo}">
        <textarea id="swal-mensaje" class="swal2-textarea" placeholder="Mensaje">${pub.mensaje}</textarea>
      `,
      confirmButtonText: 'Guardar Cambios',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      // preConfirm se ejecuta antes de confirmar y nos da los valores
      preConfirm: () => {
        const titulo = (document.getElementById('swal-titulo') as HTMLInputElement).value;
        const mensaje = (document.getElementById('swal-mensaje') as HTMLTextAreaElement).value;
        
        if (!titulo || !mensaje) {
          Swal.showValidationMessage(`El título y el mensaje son obligatorios`);
          return false; // Evita que se cierre
        }
        return { titulo, mensaje };
      }
    }).then((result) => {
      // Si el usuario confirmó y preConfirm devolvió los datos
      if (result.isConfirmed && result.value) {
        const { titulo, mensaje } = result.value;
        
        this.pubService.actualizarPublicacion(pub._id, { titulo, mensaje }).subscribe({
          next: () => {
            this.cargarPublicaciones(); // Recargamos los posts para ver el cambio
            Swal.fire('¡Actualizado!', 'Tu publicación ha sido modificada.', 'success');
          },
          error: (err) => {
            console.error('Error al actualizar:', err);
            Swal.fire('Error', 'No se pudo actualizar la publicación.', 'error');
          }
        });
      }
    });
  }

}