import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtRequestDTO } from '../models/jwtRequestDTO';
import { isPlatformBrowser } from '@angular/common';

export type AppRole = 'ADMIN' | 'VENDEDOR' | 'ESTUDIANTE';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private tokenKey = 'token';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // ========= AUTH API =========
  login(request: JwtRequestDTO) {
    return this.http.post('http://localhost:8080/login', request);
  }

  // ========= TOKEN =========
  setToken(token: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.tokenKey);
  }

  clear(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('username');
    localStorage.removeItem('nombreUsuario');
  }

  verificar(): boolean {
    if (!this.isBrowser()) return false;

    const token = this.getToken();
    if (!token) return false;

    try {
      const helper = new JwtHelperService();
      return !helper.isTokenExpired(token);
    } catch {
      return false;
    }
  }

  // ========= ROLE / USER =========
  /** Convierte cualquier formato a ADMIN|VENDEDOR|COMPRADOR */
  private normalizeRole(raw: string | null | undefined): AppRole | null {
    if (!raw) return null;

    const r = String(raw)
      .trim()
      .toUpperCase()
      .replace(/^ROLE_/, '');

    // alias por tu caso: ESTUDIANTE == COMPRADOR
    if (r === 'ESTUDIANTE') return 'ESTUDIANTE';

    if (r === 'ADMIN' || r === 'VENDEDOR' || r === 'ESTUDIANTE') return r;
    return null;
  }

  /** Obtiene rol desde localStorage(rol) o desde el token */
  getRole(): AppRole | null {
    if (!this.isBrowser()) return null;

    // 1) si el login ya guardó localStorage.rol, úsalo
    const stored = this.normalizeRole(localStorage.getItem('rol'));
    if (stored) return stored;

    // 2) si no, decodifica token
    const token = this.getToken();
    if (!token) return null;

    try {
      const helper = new JwtHelperService();
      const decoded: any = helper.decodeToken(token);

      const fromClaims =
        decoded?.role ||
        decoded?.rol ||
        decoded?.authority ||
        decoded?.authorities?.[0] ||
        decoded?.roles?.[0];

      const role =
        typeof fromClaims === 'string'
          ? fromClaims
          : fromClaims?.authority || fromClaims?.nombreRol || null;

      const normalized = this.normalizeRole(role);

      // si lo encontramos, lo guardamos para uso rápido en UI
      if (normalized) localStorage.setItem('rol', normalized);

      return normalized;
    } catch {
      return null;
    }
  }

  getNombreUsuario(): string {
    if (!this.isBrowser()) return 'Usuario';
    return (
      localStorage.getItem('nombreUsuario') ||
      localStorage.getItem('username') ||
      'Usuario'
    );
  }

  hasAnyRole(...roles: AppRole[]): boolean {
    const current = this.getRole();
    if (!current) return false;
    return roles.includes(current);
  }
}
