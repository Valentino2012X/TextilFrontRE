import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService, AppRole } from '../services/login-service';

export const rolesGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  // Si no está logueado → login
  if (!loginService.verificar()) {
    return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
  }

  const allowed = (route.data?.['roles'] as AppRole[] | undefined) ?? [];

  // Si la ruta NO define roles, permitir acceso
  if (allowed.length === 0) return true;

  const rol = loginService.getRole();

  console.log('GUARD → Rol usuario:', rol);
  console.log('GUARD → Roles permitidos:', allowed);

  // Si coincide el rol → permitir
  if (rol && allowed.includes(rol)) return true;

  return router.createUrlTree(['/home'], { queryParams: { denied: state.url } });
};
