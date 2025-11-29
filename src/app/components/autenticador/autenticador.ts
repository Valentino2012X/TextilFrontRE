// src/app/components/autenticador/autenticador.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoginService } from '../../services/login-service';
import { JwtRequestDTO } from '../../models/jwtRequestDTO';

@Component({
  selector: 'app-autenticador',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './autenticador.html',
  styleUrl: './autenticador.css',
})
export class Autenticador {
  username: string = '';
  password: string = '';
  mensaje: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // 🔴 Esta función faltaba → arregla el (click)="cerrar()"
  cerrar(): void {
    this.loginService.clear();   // limpia sesión por si acaso
    this.router.navigate(['/home']);
  }

  login(): void {
    const req = new JwtRequestDTO();
    req.username = this.username;
    req.password = this.password;

    this.loginService.login(req).subscribe({
      next: (data: any) => {
        // Backend devuelve JwtResponseDTO { jwttoken }
        const token: string | undefined =
          data?.jwttoken || data?.token || data?.jwtToken;

        if (!token) {
          this.mensaje = 'No se recibió el token JWT del backend.';
          this.snackBar.open(this.mensaje, 'Cerrar', { duration: 2500 });
          return;
        }

        // Guardar token + usuario + roles
        this.loginService.saveTokenAndUser(token);

        // Ir al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.mensaje = 'Usuario o contraseña incorrectos';
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 2500 });
      },
    });
  }
}