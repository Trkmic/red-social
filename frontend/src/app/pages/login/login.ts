import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class Login implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      emailOrUsername: [{ value: '', disabled: this.loading }, Validators.required],
      password: [{ value: '', disabled: this.loading }, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.loginForm.disable(); // Bloquea el formulario mientras carga

      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          setTimeout(() => {
            this.loading = false;
            this.loginForm.enable(); // Vuelve a habilitar el formulario
            this.router.navigate(['/publicaciones']);
          }, 1000);
        },
        error: (err) => {
          this.loading = false;
          this.loginForm.enable(); // Siempre habilitar de nuevo
          Swal.fire({
            icon: 'error',
            title: 'Error de login',
            text: err.error?.message || 'Usuario o contraseña incorrectos',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  }

  register() {
    this.router.navigate(['/registro']);
  }
}