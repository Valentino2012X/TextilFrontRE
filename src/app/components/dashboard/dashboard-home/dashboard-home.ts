// src/app/components/dashboard/dashboard-home/dashboard-home.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginService, AppRole } from '../../../services/login-service';

// Rol que usaremos solo en la VISTA
type ViewRole = 'ADMIN' | 'VENDEDOR' | 'ESTUDIANTE' | 'UNKNOWN';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-home.html', // asegúrate que el nombre coincida
  styleUrl: './dashboard-home.css',
})
export class DashboardHomeComponent implements OnInit {
  private loginService = inject(LoginService);

  rol: ViewRole = 'UNKNOWN';

  ngOnInit(): void {
    // getRole() devuelve: AppRole | null => 'ADMIN' | 'VENDEDOR' | 'COMPRADOR' | null
    const role: AppRole | null = this.loginService.getRole();

    if (role === 'ESTUDIANTE') {
      // 👇 Para la UI lo mostramos como ESTUDIANTE
      this.rol = 'ESTUDIANTE';
    } else if (role === 'ADMIN' || role === 'VENDEDOR') {
      this.rol = role;
    } else {
      this.rol = 'UNKNOWN';
    }
  }

  // Helpers opcionales por si los quieres usar en el HTML
  isAdmin(): boolean {
    return this.rol === 'ADMIN';
  }

  isVendedor(): boolean {
    return this.rol === 'VENDEDOR';
  }

  isEstudiante(): boolean {
    return this.rol === 'ESTUDIANTE';
  }
}
