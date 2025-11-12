import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';
import { AutofocusDirective } from '../../core/directivas/autofocus.directive';
import { ClickControlDirective  } from '../../core/directivas/clickControl.directive';
import { ResaltarInvalidoDirective  } from '../../core/directivas/resaltarInvalido.directive';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ResaltarInvalidoDirective, ClickControlDirective, AutofocusDirective],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  registerForm!: FormGroup;
  selectedFile?: File;
  previewImage?: string;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]],
      fechaNacimiento: [''],
      descripcion: [''],
      perfil: ['usuario'],
    });
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      Swal.fire('Error', 'Por favor completá todos los campos correctamente.', 'error');
      return;
    }

    const { password, repeatPassword } = this.registerForm.value;

    if (password !== repeatPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.registerForm.value.nombre || '');
    formData.append('apellido', this.registerForm.value.apellido || '');
    formData.append('email', this.registerForm.value.email || '');
    formData.append('nombreUsuario', this.registerForm.value.nombreUsuario || '');
    formData.append('password', this.registerForm.value.password || '');
    formData.append('repeatPassword', this.registerForm.value.repeatPassword || '');
    formData.append('fechaNacimiento', this.registerForm.value.fechaNacimiento || '');
    formData.append('descripcion', this.registerForm.value.descripcion || '');
    formData.append('perfil', this.registerForm.value.perfil || 'usuario');

    if (this.selectedFile) {
      formData.append('imagenPerfil', this.selectedFile);
    }

    try {
      this.loading = true; 

      const res = await lastValueFrom(this.authService.register(formData));

      Swal.fire({
        icon: 'success',
        title: 'Registro completado',
        text: 'Tu cuenta fue creada correctamente.',
        confirmButtonText: 'Ir al login',
      }).then(() => this.router.navigate(['/login']));
    } catch (error: any) {

      const backendMessage =
        error?.error?.message || error?.message || 'Ocurrió un error durante el registro.';

      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: Array.isArray(backendMessage)
          ? backendMessage.join('\n')
          : backendMessage,
      });
    } finally {
      this.loading = false; 
    }
  }
}
