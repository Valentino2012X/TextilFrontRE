import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { LoginService } from '../../services/login-service';
import { NavbarComponent } from './navbar/navbar';

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
  private router = inject(Router);
  private loginService = inject(LoginService);

  nombreActual = 'Usuario';
  rolActual: string | null = null;

  ngOnInit(): void {
    if (!this.loginService.verificar()) {
      this.loginService.clear();
      this.router.navigate(['/login']);
      return;
    }

    this.cargarSesion();
  }

  private cargarSesion(): void {
    const nombre =
      localStorage.getItem('nombreUsuario') ||
      localStorage.getItem('username') ||
      'Usuario';

    this.nombreActual = nombre;

    const rolGuardado = localStorage.getItem('rol');
    const rolToken = this.loginService.showRole();

    this.rolActual = this.normalizarRol(rolGuardado || rolToken);
  }

  private normalizarRol(rol: string | null): string | null {
    if (!rol) return null;
    return rol
      .replace(/^ROLE_/, '')
      .replace(/[\[\]"]/g, '')
      .trim()
      .toUpperCase();
  }

  get userInitials(): string {
    const parts = (this.nombreActual || 'U').trim().split(/\s+/);
    const a = parts[0]?.[0] ?? 'U';
    const b = parts[1]?.[0] ?? '';
    return (a + b).toUpperCase();
  }

  logout(): void {
    this.loginService.clear();
    this.router.navigate(['/home']); // o /login si quieres
  }
}
