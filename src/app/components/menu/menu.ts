import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrl: './menu.css',
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class MenuComponent {
  @ViewChild('menuScroll', { read: ElementRef })
  menuScroll!: ElementRef<HTMLDivElement>;

  scrollLeft(): void {
    if (!this.menuScroll) return;
    this.menuScroll.nativeElement.scrollBy({
      left: -180,
      behavior: 'smooth',
    });
  }

  scrollRight(): void {
    if (!this.menuScroll) return;
    this.menuScroll.nativeElement.scrollBy({
      left: 180,
      behavior: 'smooth',
    });
  }
}
