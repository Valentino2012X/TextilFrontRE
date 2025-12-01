// src/app/components/dashboard/dashboard.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { NavbarComponent } from './navbar/navbar';
import { LoginService } from '../../services/login-service';

type RolKey = 'ADMIN' | 'VENDEDOR' | 'ESTUDIANTE' | 'UNKNOWN';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private loginService = inject(LoginService);

  rolActual: RolKey = 'UNKNOWN';
  nombreActual = 'Usuario';

  // 🔐 Permisos por rol (EDITA AQUÍ lo que quieres permitir)
  private permissions: Record<RolKey, Set<string>> = {
    ADMIN: new Set(['*']), // ✅ Admin ve TODO
    VENDEDOR: new Set([
      // catálogos / productos
      'TIPOPRODUCTO',
      'PRODUCTO',
      'PRODUCTOFOTO',
      'FAVORITO',
      'CALIFICACION',

      // proyectos
      'TIPOPROYECTO',
      'PROYECTO',
      'COMENTARIOPROYECTO',
      'REPORTE_COMENTARIO',

      // ventas
      'PEDIDO',
      'PEDIDO_ITEM',
      'COMPROBANTE',
      'ENTREGA',
      'METODOPAGO',
      'TARJETA',

      // reportes
      'REPORTE_PRECIO',
      'REPORTE_COMPROBANTE',
      'REPORTE_COMPROBANTE_IGV',
      'REPORTE_PEDIDO',
      'REPORTE_ENTREGA',
      'REPORTE_TARJETA',
      'REPORTE_TARJETA_DETALLE',
    ]),
    ESTUDIANTE: new Set([
      // (ejemplo típico) estudiante ve catálogo/proyectos, no gestión ni pagos
      'PRODUCTO',
      'PRODUCTOFOTO',
      'FAVORITO',
      'CALIFICACION',

      'TIPOPROYECTO',
      'PROYECTO',
      'COMENTARIOPROYECTO',
      // si quieres que vea reportes, agrega keys aquí
    ]),
    UNKNOWN: new Set([]),
  };

  ngOnInit(): void {
    this.loadSession();
  }

  private normalizeRole(raw: string | null): RolKey {
    if (!raw) return 'UNKNOWN';
    const r = raw.toUpperCase().replace('ROLE_', '').trim();
    if (r === 'ADMIN' || r === 'VENDEDOR' || r === 'ESTUDIANTE') return r;
    return 'UNKNOWN';
  }

  private loadSession(): void {
    // nombre
    this.nombreActual =
      localStorage.getItem('nombreUsuario') ||
      localStorage.getItem('username') ||
      'Usuario';

    // rol (prioridad: localStorage -> token decode)
    const roleFromStorage = localStorage.getItem('rol');
    const roleFromToken = this.loginService.showRole(); // decode JWT
    const finalRole = roleFromStorage || roleFromToken || null;

    this.rolActual = this.normalizeRole(finalRole);

    // si vino del token, lo guardamos para usarlo en todo el front
    if (!roleFromStorage && this.rolActual !== 'UNKNOWN') {
      localStorage.setItem('rol', this.rolActual);
    }
  }

  get userInitials(): string {
    const parts = (this.nombreActual || 'U').trim().split(/\s+/);
    const first = parts[0]?.[0] ?? 'U';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  }

  can(key: string): boolean {
    if (this.rolActual === 'ADMIN') return true;
    const allowed = this.permissions[this.rolActual];
    if (!allowed) return false;
    return allowed.has('*') || allowed.has(key);
  }

  // para mostrar secciones solo si hay algo permitido dentro
  canAny(keys: string[]): boolean {
    return keys.some((k) => this.can(k));
  }

  logout(): void {
    this.loginService.clear();
    this.rolActual = 'UNKNOWN';
    this.nombreActual = 'Usuario';
    this.router.navigate(['/home']);
  }
}
