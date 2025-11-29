// src/app/services/login-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtRequestDTO } from '../models/jwtRequestDTO';

export type AppRole = 'ADMIN' | 'VENDEDOR' | 'ESTUDIANTE';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8080';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  // ====== LOGIN ======
  login(request: JwtRequestDTO) {
    // Backend: POST /login devuelve JwtResponseDTO { jwttoken }
    return this.http.post<any>(`${this.apiUrl}/login`, request);
  }

  // ====== GESTIÓN DE SESIÓN ======
  saveTokenAndUser(token: string): void {
    // guardar token
    sessionStorage.setItem('token', token);

    const decoded: any = this.jwtHelper.decodeToken(token);

    // subject del token: username
    const username: string = decoded?.sub ?? decoded?.username ?? '';
    const roles: string[] = decoded?.roles ?? [];

    // guardar username y roles en sessionStorage
    sessionStorage.setItem('username', username);

    if (roles && Array.isArray(roles)) {
      sessionStorage.setItem('roles', JSON.stringify(roles));
    } else {
      sessionStorage.removeItem('roles');
    }
  }

  getToken(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    // opcional: si está expirado, limpiar sesión
    if (this.jwtHelper.isTokenExpired(token)) {
      this.clear();
      return null;
    }
    return token;
  }

  // usado por seguridadGuard
  verificar(): boolean {
    return this.getToken() !== null;
  }

  clear(): void {
    sessionStorage.clear();
  }

  // ====== ROLES / USUARIO ======

  /** roles crudos (como llegan del JWT) */
  private getRawRoles(): string[] {
    const stored = sessionStorage.getItem('roles');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // ignore
      }
    }

    const token = this.getToken();
    if (!token) return [];
    const decoded: any = this.jwtHelper.decodeToken(token);
    const roles: string[] = decoded?.roles ?? [];
    return roles ?? [];
  }

  /** roles normalizados a AppRole (ADMIN, VENDEDOR, ESTUDIANTE) */
  getRoles(): AppRole[] {
    const raw = this.getRawRoles();

    return raw
      .map((r) => (r || '').toUpperCase())
      .map((r) =>
        r.startsWith('ROLE_') ? (r.substring(5) as AppRole) : (r as AppRole)
      )
      .filter((r) =>
        ['ADMIN', 'VENDEDOR', 'ESTUDIANTE'].includes(r)
      ) as AppRole[];
  }

  /** rol principal para dashboard/menu */
  getRole(): AppRole | null {
    const roles = this.getRoles();
    return roles.length > 0 ? roles[0] : null;
  }

  /** compatibilidad con código antiguo (ej: menu viejo) */
  showRole(): any {
    return this.getRoles();
  }

  getNombreUsuario(): string {
    const username = sessionStorage.getItem('username');
    if (username) return username;

    const token = this.getToken();
    if (!token) return '';
    const decoded: any = this.jwtHelper.decodeToken(token);
    return decoded?.sub ?? decoded?.username ?? '';
  }

  /** usado por roles-guard y por dashboard/menu */
  hasAnyRole(...rolesNeeded: AppRole[]): boolean {
    const userRoles = this.getRoles();
    if (!userRoles || userRoles.length === 0) return false;

    const neededUpper = rolesNeeded.map((r) => r.toUpperCase());
    return userRoles.some((r) =>
      neededUpper.includes(r.toUpperCase() as AppRole)
    );
  }
}
