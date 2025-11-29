import { Component, OnInit } from '@angular/core';
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
  rolActual: string = '';
  nombreActual: string = 'Usuario';

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.rolActual = this.loginService.getRole() || '';
    this.nombreActual = this.loginService.getNombreUsuario();
  }

  get userInitials(): string {
    const parts = (this.nombreActual || 'U').trim().split(/\s+/);
    const first = parts[0]?.[0] ?? 'U';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  }

  // === banderas para el HTML ===
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
}
