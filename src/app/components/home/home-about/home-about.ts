import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login-service';

@Component({
  selector: 'app-home-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-about.html',
  styleUrls: ['./home-about.css'],
})
export class HomeAboutComponent implements OnInit {
  private router = inject(Router);
  private loginService = inject(LoginService);

  mobileMenuOpen = false;

  isLoggedIn = false;
  userMenuOpen = false;

  userName = 'Usuario';
  notificationCount = 0;

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

  logout(): void {
    this.loginService.clear();
    this.isLoggedIn = false;
    this.userMenuOpen = false;
    this.router.navigate(['/home']);
  }
}
