// src/app/components/dashboard/navbar/navbar.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  @Input() rol: string = '';

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }
}
