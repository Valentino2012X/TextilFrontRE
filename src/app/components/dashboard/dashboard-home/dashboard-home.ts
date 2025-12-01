import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login-service';

type RolKey = 'ADMIN' | 'VENDEDOR' | 'ESTUDIANTE' | 'UNKNOWN';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink], // ✅ IMPORTANTE para routerLink en el HTML
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHomeComponent implements OnInit {
  private loginService = inject(LoginService);

  rol: RolKey = 'UNKNOWN';

  ngOnInit(): void {
    const roleFromStorage = localStorage.getItem('rol');
    const roleFromToken = this.loginService.showRole();
    this.rol = this.normalizeRole(roleFromStorage || roleFromToken || null);
  }

  private normalizeRole(raw: string | null): RolKey {
    if (!raw) return 'UNKNOWN';
    const r = raw.toUpperCase().replace('ROLE_', '').trim();
    if (r === 'ADMIN' || r === 'VENDEDOR' || r === 'ESTUDIANTE') return r;
    return 'UNKNOWN';
  }
}
