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
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
        ]
      ]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Login exitoso',
            text: 'Bienvenido 👋',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.router.navigate(['/publicaciones']);
          });
        },
        error: (err) => {
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
