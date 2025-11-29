// src/app/components/autenticador/autenticador.ts
import { Component, OnInit } from '@angular/core';
import { JwtRequestDTO } from '../../models/jwtRequestDTO';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-autenticador',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, NgIf],
  templateUrl: './autenticador.html',
  styleUrl: './autenticador.css',
})
export class Autenticador implements OnInit {
  username: string = '';
  password: string = '';
  mensaje: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // opcional: limpiar sesión al entrar al login
    sessionStorage.clear();
  }

  login() {
    let request = new JwtRequestDTO();
    request.username = this.username;
    request.password = this.password;

    this.loginService.login(request).subscribe(
      (data: any) => {
        // JwtResponseDTO -> campo jwttoken
        sessionStorage.setItem('token', data.jwttoken);

        // 👇 AQUÍ GUARDAMOS EL ROL
        // Opción 1: si tu backend manda data.rol = 'ADMIN'
        if (data.rol) {
          sessionStorage.setItem('rol', data.rol);
        }

        // Opción 2: si tu backend manda data.authorities o data.roles
        const authorities = data.authorities || data.roles;
        if (authorities && authorities.length) {
          const first = authorities[0];
          const rol =
            typeof first === 'string'
              ? first
              : first.authority || first.nombreRol || '';

          if (rol) {
            sessionStorage.setItem('rol', rol);
          }
        }

        // Ir al dashboard (que a su vez muestra Usuarios como contenido)
        this.router.navigate(['/usuarios']);
      },
      (error) => {
        this.mensaje = 'Credenciales incorrectas!!!';
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
      }
    );
  }
}
