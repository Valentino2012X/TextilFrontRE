// src/app/components/dashboard/dashboard.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { LoginService } from '../../services/login-service';
import { NavbarComponent } from './navbar/navbar';

// 👇 NUEVOS imports
import { UsuarioService } from '../../services/usuario-service';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    NavbarComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  rolActual: string = '';
  nombreActual: string = 'Usuario';

  // 👇 NUEVOS
  fotoUrlActual: string | null = null;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.rolActual = this.loginService.getRole() || '';
    this.nombreActual = this.loginService.getNombreUsuario();

    // 👇 buscamos al usuario logueado para obtener su fotoUrl
    const usernameActual = this.authService.getUsernameFromToken();

    if (usernameActual) {
      this.usuarioService.list().subscribe({
        next: (lista: Usuario[]) => {
          const u = lista.find((x) => x.username === usernameActual);
          if (u) {
            this.fotoUrlActual = u.fotoUrl || null;
          }
        },
        error: (err) => {
          console.error('Error cargando usuario actual para foto de perfil', err);
        },
      });
    }
  }

  get userInitials(): string {
    const parts = (this.nombreActual || 'U').trim().split(/\s+/);
    const first = parts[0]?.[0] ?? 'U';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  }

  get isAdmin(): boolean {
    return this.loginService.hasAnyRole('ADMIN');
  }
  get isVendedor(): boolean {
    return this.loginService.hasAnyRole('VENDEDOR');
  }
  get isComprador(): boolean {
    return this.loginService.hasAnyRole('ESTUDIANTE');
  }

  logout(): void {
    this.loginService.clear();
    this.router.navigate(['/home']);
  }

  // 👇 NUEVO: ir a la pantalla de perfil
  irAPerfil(): void {
    this.router.navigate(['/perfil']);
  }
}
