import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login-service';

export const seguridadGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  if (loginService.verificar()) return true;

  return router.createUrlTree(['/login'], {
    queryParams: { redirect: state.url },
  });
};
