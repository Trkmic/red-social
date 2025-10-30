import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  registerForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
        ]
      ],
      confirmPassword: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
      perfil: ['usuario', Validators.required]
    });
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    // Validar tipo de imagen
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'warning',
        title: 'Archivo no válido',
        text: 'Solo se permiten imágenes JPG, PNG, GIF o TIFF',
        confirmButtonColor: '#f0ad4e'
      });
      this.selectedFile = null;
      event.target.value = ''; // limpiar input
      return;
    }

    this.selectedFile = file;
  }

  onSubmit() {
    if (
      this.registerForm.valid &&
      this.registerForm.value.password === this.registerForm.value.confirmPassword
    ) {
      const formData = new FormData();

      // Mapear campos del formulario al backend
      Object.entries(this.registerForm.value).forEach(([key, value]) => {
        if (key === 'username') {
          formData.append('nombreUsuario', value as string); // backend espera nombreUsuario
        } else if (key !== 'confirmPassword') { // no enviar confirmPassword
          formData.append(key, value as string);
        }
      });

      if (this.selectedFile) {
        formData.append('imagenPerfil', this.selectedFile);
      }

      this.authService.register(formData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso 🎉',
            text: 'Tu cuenta fue creada correctamente',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: err.error?.message || 'Ocurrió un problema, intenta nuevamente',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Las contraseñas no coinciden o hay campos vacíos',
        confirmButtonColor: '#f0ad4e'
      });
    }
  }
}
