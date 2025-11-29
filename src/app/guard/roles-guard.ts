// src/app/guard/roles-guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService, AppRole } from '../services/login-service';

export const rolesGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  // 1. Si no hay sesión → a login
  if (!loginService.verificar()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Roles esperados desde la ruta (data: { roles: ['ADMIN', ...] })
  const expected = route.data['roles'] as AppRole[] | undefined;

  // Si la ruta no define roles, solo exige estar logueado
  if (!expected || expected.length === 0) {
    return true;
  }

  // 3. Verificamos si el usuario tiene alguno de los roles requeridos
  const ok = loginService.hasAnyRole(...expected);
  if (!ok) {
    // Puedes mandarlo a 'forbidden' si tienes esa ruta, o al dashboard
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};