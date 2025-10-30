import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicacionesService, Publicacion } from '../../core/services/publicaciones.service';
import { AuthService } from '../../core/services/auth.service';
import { LimitadorCaracteresPipe } from '../../core/pipes/limitador_caracteres.pipe';
import { FormateoHoraPipe } from '../../core/pipes/formateo_hora.pipe';
import { MayusculaLetraPipe } from '../../core/pipes/mayuscula_letra.pipe';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.html',
  imports: [CommonModule, ReactiveFormsModule, LimitadorCaracteresPipe,FormateoHoraPipe,MayusculaLetraPipe],
  styleUrls: ['./publicaciones.css']
})
export class Publicaciones implements OnInit {
  publicaciones: Publicacion[] = [];
  formPublicacion: FormGroup;
  usuarioLogueado: any = null;
  loading = false;
  selectedFile: File | null = null;

  constructor(
    private pubService: PublicacionesService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Inicializamos el formulario desde el constructor
    this.formPublicacion = this.fb.group({
      titulo: ['', Validators.required],
      mensaje: ['', Validators.required],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.usuarioLogueado = this.authService.getUsuarioLogueado();
    
    // Si no hay usuario logueado, redirigir al login
    if (!this.usuarioLogueado) {
      window.location.href = '/login';
      return;
    }

    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    this.pubService.obtenerPublicaciones().subscribe({
      next: (data) => this.publicaciones = data,
      error: (err) => console.error('Error al cargar publicaciones:', err)
    });
  }

  toggleLike(pub: Publicacion) {
    if (!this.usuarioLogueado?._id) return;

    const liked = pub.likes.includes(this.usuarioLogueado._id);
    const obs = liked ? this.pubService.quitarLike(pub._id) : this.pubService.darLike(pub._id);

    obs.subscribe({
      next: () => this.cargarPublicaciones(),
      error: (err) => console.error('Error al cambiar like:', err)
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  crearPublicacion() {
    if (this.formPublicacion.invalid) return;

    this.loading = true;

    const formData = new FormData();
    formData.append('titulo', this.formPublicacion.get('titulo')?.value);
    formData.append('mensaje', this.formPublicacion.get('mensaje')?.value);
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }
    formData.append('usuarioId', this.usuarioLogueado._id);

    this.pubService.crearPublicacion(formData).subscribe({
      next: () => {
        this.loading = false;
        this.formPublicacion.reset();
        this.selectedFile = null;
        this.cargarPublicaciones();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al crear publicación:', err);
      }
    });
  }
}

