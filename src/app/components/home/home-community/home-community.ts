import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login-service';

type DemoKey = 'follow' | 'projects' | 'share' | 'challenges';

@Component({
  selector: 'app-home-community',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-community.html',
  styleUrls: ['./home-community.css'],
})
export class HomeCommunityComponent implements OnInit {
  private router = inject(Router);
  private loginService = inject(LoginService);

  mobileMenuOpen = false;

  isLoggedIn = false;
  userMenuOpen = false;

  userName = 'Usuario';
  notificationCount = 0;

  activeDemo: DemoKey | null = null;
  demoText = '';

  ngOnInit(): void {
    this.loadSession();
  }

  private loadSession(): void {
    this.isLoggedIn = this.loginService.verificar();

    if (!this.isLoggedIn) {
      this.userName = 'Usuario';
      this.notificationCount = 0;
      this.userMenuOpen = false;
      return;
    }

    this.userName =
      localStorage.getItem('username') || localStorage.getItem('nombreUsuario') || 'Usuario';

    const notif = localStorage.getItem('notificationCount');
    this.notificationCount = notif && !Number.isNaN(Number(notif)) ? Number(notif) : 3;
  }

  get userInitials(): string {
    const parts = (this.userName || 'U').trim().split(/\s+/);
    const first = parts[0]?.[0] ?? 'U';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  toggleNotifications(): void {
    this.notificationCount = 0;
    localStorage.setItem('notificationCount', '0');
  }

  activateDemo(key: DemoKey): void {
    this.activeDemo = key;

    const map: Record<DemoKey, string> = {
      follow:
        'Sigue a otros diseñadores y crea una red. Recibe actualizaciones de sus publicaciones y proyectos.',
      projects:
        'Explora proyectos compartidos por la comunidad, comenta y aprende del proceso creativo de otros.',
      share:
        'Publica tus creaciones, añade fotos y cuenta tu historia. Obtén feedback y aumenta tu visibilidad.',
      challenges:
        'Participa en retos mensuales de moda sostenible, gana exposición y mejora tu portafolio.',
    };

    this.demoText = map[key];
  }

  logout(): void {
    this.loginService.clear();
    this.isLoggedIn = false;
    this.userMenuOpen = false;
    this.router.navigate(['/home']);
  }
}
