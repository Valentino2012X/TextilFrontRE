// src/app/components/autenticador/autenticador.ts
import { Component, OnInit } from '@angular/core';
import { JwtRequestDTO } from '../../models/jwtRequestDTO';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-autenticador',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
    RouterLink,
  ],
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
    sessionStorage.clear();
  }

  cerrar() {
    // si no tienes /home, cámbialo por /login o /dashboard
    this.router.navigate(['/home']);
  }

  login() {
    const u = (this.username || '').trim();
    const p = (this.password || '').trim();

    if (!u && !p) {
      this.snackBar.open('Completa tu usuario y contraseña.', 'Aviso', { duration: 2500 });
      return;
    }
    if (!u) {
      this.snackBar.open('El campo "Usuario" está vacío.', 'Aviso', { duration: 2500 });
      return;
    }
    if (!p) {
      this.snackBar.open('El campo "Contraseña" está vacío.', 'Aviso', { duration: 2500 });
      return;
    }

    const request = new JwtRequestDTO();
    request.username = u;
    request.password = p;

    this.loginService.login(request).subscribe(
      (data: any) => {
        sessionStorage.setItem('token', data.jwttoken);

        if (data.rol) sessionStorage.setItem('rol', data.rol);

        const authorities = data.authorities || data.roles;
        if (authorities?.length) {
          const first = authorities[0];
          const rol =
            typeof first === 'string' ? first : first.authority || first.nombreRol || '';
          if (rol) sessionStorage.setItem('rol', rol);
        }

        this.router.navigate(['/usuarios']);
      },
      () => {
        this.mensaje = 'Usuario o contraseña incorrectos.';
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 2500 });
      }
    );
  }
}
