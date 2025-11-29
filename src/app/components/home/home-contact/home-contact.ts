import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { LoginService } from '../../../services/login-service';

@Component({
  selector: 'app-home-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './home-contact.html',
  styleUrls: ['./home-contact.css'],
})
export class HomeContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private loginService = inject(LoginService);

  mobileMenuOpen = false;

  isLoggedIn = false;
  userMenuOpen = false;

  userName = 'Usuario';
  notificationCount = 0;

  showSuccess = false;
  showError = false;

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    supportType: ['', [Validators.required]],
    subject: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
  });

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

  selectSupport(type: string): void {
    this.form.patchValue({ supportType: type });
  }

  enviar(): void {
    this.showSuccess = false;
    this.showError = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showError = true;
      return;
    }

    this.showSuccess = true;
    this.form.reset({ supportType: '' });
    setTimeout(() => (this.showSuccess = false), 3500);
  }

  logout(): void {
    this.loginService.clear();
    this.isLoggedIn = false;
    this.userMenuOpen = false;
    this.router.navigate(['/home']);
  }
}
