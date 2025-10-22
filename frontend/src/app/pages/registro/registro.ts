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
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (
      this.registerForm.valid &&
      this.registerForm.value.password === this.registerForm.value.confirmPassword
    ) {
      this.authService.register(this.registerForm.value).subscribe({
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
            text: 'Ocurrió un problema, intenta nuevamente',
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
