// src/app/components/dashboard/dashboard-home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

type Rol = 'ADMIN' | 'VENDEDOR' | 'COMPRADOR';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, NgIf,RouterLink],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHomeComponent implements OnInit {
  rol: Rol = 'COMPRADOR';

  ngOnInit(): void {
    const raw =
      sessionStorage.getItem('rol') || localStorage.getItem('rol') || 'COMPRADOR';

    const upper = raw.toUpperCase();
    if (upper.includes('ADMIN')) this.rol = 'ADMIN';
    else if (upper.includes('VENDEDOR')) this.rol = 'VENDEDOR';
    else this.rol = 'COMPRADOR';
  }
}