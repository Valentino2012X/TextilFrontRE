import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

type Category = 'all' | 'tejidos' | 'hilos' | 'adornos' | 'organicos';

interface ProductItem {
  title: string;
  price: string;
  desc: string;
  img: string;
  alt: string;
  category: Exclude<Category, 'all'>;
}

interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  avatar: string;
  alt: string;
}

@Component({
  selector: 'app-home-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-products.html',
  styleUrls: ['./home-products.css'], // ✅ CORRECTO
})
export class HomeProductsComponent {
  mobileMenuOpen = false;

  isLoggedIn = !!localStorage.getItem('token');
  userMenuOpen = false;

  userName = localStorage.getItem('username') ?? 'Usuario';
  notificationCount = 3;

  selectedCategory: Category = 'all';

  products: ProductItem[] = [
    {
      title: 'Algodón Blanco Premium',
      price: 'S/15.99/metro',
      desc: 'Tejido 100% algodón orgánico, ideal para prendas básicas y ropa de bebé.',
      category: 'tejidos',
      alt: 'Algodón Blanco',
      img:
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23f8f9fa' width='400' height='250'/><rect fill='%23ffffff' x='50' y='50' width='300' height='150' rx='10'/><text x='200' y='130' text-anchor='middle' font-family='Arial' font-size='16' fill='%23666'>Algodón Blanco</text></svg>",
    },
    {
      title: 'Denim Azul Clásico',
      price: 'S/22.50/metro',
      desc: 'Denim resistente de alta calidad, perfecto para jeans y chaquetas.',
      category: 'tejidos',
      alt: 'Denim Azul',
      img:
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23f8f9fa' width='400' height='250'/><rect fill='%23004d7a' x='50' y='50' width='300' height='150' rx='10'/><text x='200' y='130' text-anchor='middle' font-family='Arial' font-size='16' fill='%23ffffff'>Denim Azul</text></svg>",
    },
    {
      title: 'Popelín Cuadriculado Azul Marino',
      price: 'S/18.75/metro',
      desc: 'Algodón popelín con patrón cuadriculado elegante para camisas formales.',
      category: 'tejidos',
      alt: 'Popelín Cuadriculado',
      img:
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23f8f9fa' width='400' height='250'/><rect fill='%23001f3f' x='50' y='50' width='300' height='150' rx='10'/><pattern id='checks' patternUnits='userSpaceOnUse' width='20' height='20'><rect fill='%23001f3f' width='20' height='20'/><rect fill='%23ffffff' x='0' y='0' width='10' height='10'/><rect fill='%23ffffff' x='10' y='10' width='10' height='10'/></pattern><rect fill='url(%23checks)' x='50' y='50' width='300' height='150' rx='10'/><text x='200' y='220' text-anchor='middle' font-family='Arial' font-size='16' fill='%23666'>Popelín Cuadriculado</text></svg>",
    },
    {
      title: 'Sarga Negra Algodón Orgánico',
      price: 'S/25.00/metro',
      desc: 'Sarga de algodón orgánico certificado GOTS, ideal para pantalones y uniformes.',
      category: 'organicos',
      alt: 'Sarga Negra Orgánica',
      img:
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23f8f9fa' width='400' height='250'/><rect fill='%23000000' x='50' y='50' width='300' height='150' rx='10'/><text x='200' y='130' text-anchor='middle' font-family='Arial' font-size='16' fill='%23ffffff'>Sarga Orgánica</text></svg>",
    },
    {
      title: 'Oxford Algodón Morado',
      price: 'S/20.25/metro',
      desc: 'Tejido Oxford de algodón en elegante color morado, perfecto para camisas casuales.',
      category: 'tejidos',
      alt: 'Oxford Morado',
      img:
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23f8f9fa' width='400' height='250'/><rect fill='%23663399' x='50' y='50' width='300' height='150' rx='10'/><text x='200' y='130' text-anchor='middle' font-family='Arial' font-size='16' fill='%23ffffff'>Oxford Morado</text></svg>",
    },
    {
      title: 'Hilo Verde Delgado',
      price: 'S/3.50/bobina',
      desc: 'Hilo de poliéster de alta resistencia, ideal para costuras y bordados.',
      category: 'hilos',
      alt: 'Hilo Verde',
      img:
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23f8f9fa' width='400' height='250'/><circle cx='200' cy='125' r='60' fill='%23228b22'/><text x='200' y='220' text-anchor='middle' font-family='Arial' font-size='16' fill='%23666'>Hilo Verde</text></svg>",
    },
    {
      title: 'Hilo Beige Grueso',
      price: 'S/4.25/bobina',
      desc: 'Hilo grueso de algodón natural, perfecto para tapicería y proyectos pesados.',
      category: 'hilos',
      alt: 'Hilo Beige',
      img:
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23f8f9fa' width='400' height='250'/><circle cx='200' cy='125' r='60' fill='%23daa520'/><text x='200' y='220' text-anchor='middle' font-family='Arial' font-size='16' fill='%23666'>Hilo Beige</text></svg>",
    },
    {
      title: 'Botones Negros Clásicos',
      price: 'S/8.99/set',
      desc: 'Set de 12 botones negros de alta calidad, perfectos para camisas y abrigos.',
      category: 'adornos',
      alt: 'Botones Negros',
      img:
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'><rect fill='%23f8f9fa' width='400' height='250'/><circle cx='150' cy='125' r='20' fill='%23000000'/><circle cx='200' cy='125' r='20' fill='%23000000'/><circle cx='250' cy='125' r='20' fill='%23000000'/><text x='200' y='220' text-anchor='middle' font-family='Arial' font-size='16' fill='%23666'>Botones Negros</text></svg>",
    },
  ];

  testimonials: TestimonialItem[] = [
    {
      name: 'María Velásquez',
      role: 'Diseñadora de Moda',
      text:
        'Gracias a TextilConnect he podido acceder a materiales únicos y económicos para mis proyectos. Además de ahorrar dinero, siento que estoy aportando al cuidado del medio ambiente.',
      alt: 'Maria',
      avatar:
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23667eea'/><text x='50' y='60' text-anchor='middle' font-family='Arial' font-size='40' fill='white'>M</text></svg>",
    },
    {
      name: 'Damián Cruz',
      role: 'Propietario de Taller',
      text:
        'Antes botábamos muchos retazos que no sabíamos cómo aprovechar. Ahora, con TextilConnect, los vendemos fácilmente y hasta nos ayudan a llevar un mejor control financiero del taller.',
      alt: 'Damian',
      avatar:
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23764ba2'/><text x='50' y='60' text-anchor='middle' font-family='Arial' font-size='40' fill='white'>D</text></svg>",
    },
  ];

  constructor(private router: Router) {}

  get filteredProducts(): ProductItem[] {
    if (this.selectedCategory === 'all') return this.products;
    return this.products.filter((p) => p.category === this.selectedCategory);
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  setCategory(c: Category): void {
    this.selectedCategory = c;
  }

  comprar(p: ProductItem): void {
    alert(`Comprar: ${p.title} - ${p.price}`);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('nombreUsuario');
    this.isLoggedIn = false;
    this.userMenuOpen = false;
    this.router.navigate(['/autenticador']);
  }

  trackByTitle(_: number, item: ProductItem): string {
    return item.title;
  }
}
