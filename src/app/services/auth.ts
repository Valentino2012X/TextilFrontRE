import { Injectable } from '@angular/core';

export type Rol = 'ADMIN' | 'VENDEDOR' | 'ESTUDIANTE';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token'; // nombre de la clave del JWT

  // ⚠️ Usamos sessionStorage para que coincida con tokenGetter en app.config.ts
  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.sessionStorage.getItem(this.tokenKey);
  }

  // 🔑 Obtiene el rol principal del token JWT
  getRoleFromToken(): Rol {
    const token = this.getToken();
    if (!token) {
      return 'ESTUDIANTE';
    }

    // JWT = header.payload.signature → decodificamos el payload
    const payloadPart = token.split('.')[1];
    if (!payloadPart) {
      return 'ESTUDIANTE';
    }

    try {
      const payloadJson = atob(payloadPart);
      const payload = JSON.parse(payloadJson);

      // ⚠️ AJUSTA ESTO SEGÚN EL CLAIM REAL DEL BACKEND
      // revísalo en un jwt.io con un token real si quieres
      const rawRole: string =
        payload.rol ||
        payload.role ||
        payload.authority ||
        payload.authorities?.[0];

      const upper = (rawRole || '').toUpperCase();

      if (upper.includes('ADMIN')) return 'ADMIN';
      if (upper.includes('VENDEDOR')) return 'VENDEDOR';
      if (upper.includes('COMPRADOR')) return 'ESTUDIANTE';

      // fallback
      return 'ESTUDIANTE';
    } catch (e) {
      console.error('Error decodificando token JWT', e);
      return 'ESTUDIANTE';
    }
  }
}
