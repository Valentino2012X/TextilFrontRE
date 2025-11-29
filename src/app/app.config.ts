// src/app/app.config.ts
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  if (typeof window === 'undefined') return null;

  const token = window.sessionStorage.getItem('token');
  // Validamos que parezca un JWT (3 partes separadas por ".")
  return token && token.split('.').length === 3 ? token : null;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:8080', 'g5-textilconnect.onrender.com'],
          disallowedRoutes: [ 
            'http://localhost:8080/login',
            'https://g5-textilconnect.onrender.com/login',
          ],
        },
      })
    ),
  ],
};
