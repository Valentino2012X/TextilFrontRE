// src/app/services/login-service.ts
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtRequestDTO } from '../models/jwtRequestDTO';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly tokenKey = 'token';
  private readonly roleKey = 'rol';
  private readonly usernameKey = 'username';
  private readonly nombreUsuarioKey = 'nombreUsuario';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(request: JwtRequestDTO) {
    return this.http.post('http://localhost:8080/login', request);
  }

  setToken(token: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.tokenKey);
  }

  setRole(role: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.roleKey, role);
  }

  getRole(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.roleKey);
  }

  setUsername(username: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.usernameKey, username);
  }

  getUsername(): string | null {
    if (!this.isBrowser()) return null;
    return (
      localStorage.getItem(this.usernameKey) ||
      localStorage.getItem(this.nombreUsuarioKey)
    );
  }

  clear(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.nombreUsuarioKey);
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

  showRole(): string | null {
    if (!this.isBrowser()) return null;

    const token = this.getToken();
    if (!token) return null;

    try {
      const helper = new JwtHelperService();
      const decoded: any = helper.decodeToken(token);
      return decoded?.role || decoded?.rol || decoded?.authority || decoded?.authorities?.[0] || null;
    } catch {
      return null;
    }
  }
}
