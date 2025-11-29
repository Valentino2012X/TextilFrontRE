// src/app/components/menu/menu.ts (ajusta la ruta si es distinta)

import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginService, AppRole } from '../../services/login-service';

@Component({
  standalone: true,
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrl: './menu.css',
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class MenuComponent {
  @ViewChild('menuScroll', { read: ElementRef })
  menuScroll!: ElementRef<HTMLDivElement>;

  // guarda el rol actual del usuario
  role: AppRole | '' = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  shouldShowMenu(): boolean {
    const logged = this.loginService.verificar();

    if (logged) {
      // ✅ usamos getRole(), que ya normaliza: 'ADMIN' | 'VENDEDOR' | 'COMPRADOR'
      const currentRole = this.loginService.getRole();
      this.role = currentRole ?? '';
    } else {
      this.role = '';
    }

    // no mostramos menú en /login
    return logged && this.router.url !== '/login';
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  isVendedor(): boolean {
    return this.role === 'VENDEDOR';
  }

  isComprador(): boolean {
    return this.role === 'ESTUDIANTE';
  }

  cerrar(): void {
    // ✅ limpiamos localStorage usando el propio servicio
    this.loginService.clear();
    this.role = '';
    this.router.navigate(['/login']);
  }

  scrollLeft(): void {
    if (!this.menuScroll) return;
    this.menuScroll.nativeElement.scrollBy({
      left: -180,
      behavior: 'smooth',
    });
  }

  scrollRight(): void {
    if (!this.menuScroll) return;
    this.menuScroll.nativeElement.scrollBy({
      left: 180,
      behavior: 'smooth',
    });
  }
}
