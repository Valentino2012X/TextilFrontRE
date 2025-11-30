// src/app/components/home/home-about/home-about.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-about.html',
  styleUrls: ['./home-about.css'],
})
export class HomeAboutComponent {
  mobileMenuOpen = false;

  isLoggedIn = !!localStorage.getItem('token');
  userMenuOpen = false;

  userName = localStorage.getItem('username') ?? 'Usuario';
  notificationCount = 3;

  constructor(private router: Router) {}

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
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.isLoggedIn = false;
    this.userMenuOpen = false;
    this.router.navigate(['/autenticador']);
  }
}
