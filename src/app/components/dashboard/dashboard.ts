import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from "./navbar/navbar";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  rolActual: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.rolActual = sessionStorage.getItem('rol') || '';
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}