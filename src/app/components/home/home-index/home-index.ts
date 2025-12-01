// src/app/components/home/home-index/home-index.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login-service';

interface CardItem {
  title: string;
  desc: string;
  img: string;
  alt: string;
}

interface TrendItem {
  title: string;
  desc: string;
  safeUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-home-index',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './home-index.html',
  styleUrls: ['./home-index.css'],
})
export class HomeIndexComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);
  private loginService = inject(LoginService);

  mobileMenuOpen = false;

  isLoggedIn = false;
  userMenuOpen = false;
  userName = 'Usuario';
  notificationCount = 0;

  successMsg = '';
  errorMsg = '';

  products: CardItem[] = this.buildProducts();
  trends: TrendItem[] = this.buildTrends();

  commentForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.loadSession();
  }

  private loadSession(): void {
    // ✅ no basta con que exista token, debe ser válido (no expirado)
    this.isLoggedIn = this.loginService.verificar();

    if (!this.isLoggedIn) {
      this.userName = 'Usuario';
      this.notificationCount = 0;
      this.userMenuOpen = false;
      return;
    }

    const storedName =
      localStorage.getItem('username') || localStorage.getItem('nombreUsuario') || 'Usuario';
    this.userName = storedName;

    const notif = localStorage.getItem('notificationCount');
    this.notificationCount = notif && !Number.isNaN(Number(notif)) ? Number(notif) : 3;
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    this.loginService.clear(); // ✅ borra token, rol, username, etc.
    this.isLoggedIn = false;
    this.userMenuOpen = false;
    this.router.navigate(['/home']);
  }

  submitComment(): void {
    this.successMsg = '';
    this.errorMsg = '';

    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      this.errorMsg = 'Completa correctamente el formulario antes de enviar.';
      return;
    }

    this.successMsg = '¡Comentario enviado! Gracias por unirte a la conversación.';
    this.commentForm.reset();
  }

  private buildProducts(): CardItem[] {
    return [
      {
        title: 'Telas Premium',
        desc: 'Amplia selección de telas de alta calidad para todos tus proyectos',
        img: 'assets/Imagenes/Telas_Premium.jpg',
        alt: 'Telas Premium',
      },
      {
        title: 'Botones y Accesorios',
        desc: 'Botones, cremalleras y accesorios para completar tus diseños',
        img: 'assets/Imagenes/Botones.jpg',
        alt: 'Botones y Accesorios',
      },
      {
        title: 'Hilos Especializados',
        desc: 'Hilos de diferentes grosores y colores para coser y bordar',
        img: 'assets/Imagenes/Hilos.jpg',
        alt: 'Hilos Especializados',
      },
      {
        title: 'Telas Decorativas',
        desc: 'Telas especiales para decoración y proyectos únicos',
        img: 'assets/Imagenes/Telas_decorativas.jpg',
        alt: 'Telas Decorativas',
      },
      {
        title: 'Materiales Exclusivos',
        desc: 'Materiales únicos y de edición limitada para diseños especiales',
        img: 'assets/Imagenes/Materiales_Exclusivos.jpg',
        alt: 'Materiales Exclusivos',
      },
      {
        title: 'Herramientas',
        desc: 'Herramientas profesionales para corte, costura y acabados',
        img: 'assets/Imagenes/Herramientas.jpg',
        alt: 'Herramientas',
      },
    ];
  }

  private buildTrends(): TrendItem[] {
    return [
      {
        title: 'Sostenibilidad Textil',
        desc: 'Innovaciones en textiles sostenibles y producción eco-friendly.',
        safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://www.youtube.com/embed/9CfHd8TFL-c'
        ),
      },
      {
        title: 'Tecnología Inteligente',
        desc: 'Cómo la tecnología transforma los textiles con fibras inteligentes.',
        safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://www.youtube.com/embed/NEqPGdNnLIE'
        ),
      },
      {
        title: 'Diseño Contemporáneo',
        desc: 'Tendencias que definen el futuro de la moda y decoración textil.',
        safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://www.youtube.com/embed/IPV5P8m1QU8'
        ),
      },
    ];
  }
}
