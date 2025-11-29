import { Injectable } from '@angular/core';

export type Rol = 'ADMIN' | 'VENDEDOR' | 'COMPRADOR';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token'; // donde guardas tu JWT en localStorage

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // 🔑 Obtiene el rol principal del token JWT
  getRoleFromToken(): Rol {
    const token = this.getToken();
    if (!token) {
      // por defecto, podría ser COMPRADOR invitado, ajusta si quieres
      return 'COMPRADOR';
    }

    // JWT = header.payload.signature → decodificamos el payload
    const payloadPart = token.split('.')[1];
    if (!payloadPart) {
      return 'COMPRADOR';
    }

    try {
      const payloadJson = atob(payloadPart);
      const payload = JSON.parse(payloadJson);

      // ⚠️ AJUSTA ESTO SEGÚN TU CLAIM REAL
      // ej. puede ser payload.rol, payload.role, payload.authorities[0], etc.
      const rawRole: string =
        payload.rol || payload.role || payload.authority || payload.authorities?.[0];

      const upper = (rawRole || '').toUpperCase();

      if (upper.includes('ADMIN')) return 'ADMIN';
      if (upper.includes('VENDEDOR')) return 'VENDEDOR';
      if (upper.includes('COMPRADOR')) return 'COMPRADOR';

      // fallback
      return 'COMPRADOR';
    } catch (e) {
      console.error('Error decodificando token JWT', e);
      return 'COMPRADOR';
    }
  }
}