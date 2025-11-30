// src/app/components/home/home-story/home-story.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface TimelineItem {
  side: 'left' | 'right';
  year: string;
  title: string;
  content: string;
}

interface ProblemItem {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home-story',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-story.html',
  styleUrl: './home-story.css',
})
export class HomeStoryComponent {
  mobileMenuOpen = false;

  // (ajústalo a tu LoginService si ya lo tienes)
  isLoggedIn = !!localStorage.getItem('token');
  userName = localStorage.getItem('username') ?? 'Usuario';
  notificationCount = 3;

  timeline: TimelineItem[] = [
    {
      side: 'left',
      year: '2023 - Identificación del Problema',
      title: 'El Despertar de una Necesidad',
      content:
        'En Gamarra, el epicentro textil del Perú, observamos una problemática silenciosa pero devastadora: toneladas de retazos textiles terminaban en vertederos cada día. Mientras tanto, estudiantes de diseño luchaban por encontrar materiales accesibles para sus proyectos creativos. Esta desconexión entre oferta y demanda nos inspiró a actuar.',
    },
    {
      side: 'right',
      year: '2024 - Investigación y Análisis',
      title: 'Comprendiendo el Ecosistema',
      content:
        'Realizamos extensas investigaciones en campo, entrevistando a más de 100 talleres textiles y 200 estudiantes de diseño. Descubrimos que el 70% de los talleres no tenían canales eficientes para comercializar sus excedentes, mientras que el 85% de los estudiantes buscaban alternativas sostenibles y económicas para sus proyectos.',
    },
    {
      side: 'left',
      year: '2024 - Desarrollo de la Solución',
      title: 'Nacimiento de TextilConnect',
      content:
        'Con un enfoque de triple impacto (económico, social y ambiental), comenzamos a desarrollar TextilConnect. Nuestra plataforma digital integra un marketplace intuitivo, herramientas de gestión financiera y un sistema de medición de impacto ambiental, creando un ecosistema completo para la economía circular textil.',
    },
    {
      side: 'right',
      year: '2024 - Validación y Prototipado',
      title: 'Probando Nuestra Hipótesis',
      content:
        'Implementamos metodologías Lean UX para validar nuestras hipótesis con usuarios reales. Los resultados fueron prometedores: 92% de los talleres mostraron interés en la plataforma, y 88% de los estudiantes consideraron que solucionaría sus principales problemas de acceso a materiales.',
    },
    {
      side: 'left',
      year: '2025 - Lanzamiento y Expansión',
      title: 'El Futuro es Ahora',
      content:
        'TextilConnect está lista para transformar la industria textil peruana. Con nuestra plataforma, los talleres pueden monetizar sus excedentes, los estudiantes acceden a materiales sostenibles, y juntos construimos un futuro más verde y próspero para todos.',
    },
  ];

  problems: ProblemItem[] = [
    {
      title: 'Desperdicio Masivo',
      description:
        'Los talleres de Gamarra generan diariamente toneladas de retazos textiles que terminan en vertederos por falta de canales de comercialización eficientes, representando una pérdida económica y ambiental significativa.',
    },
    {
      title: 'Acceso Limitado',
      description:
        'Estudiantes de diseño enfrentan altos costos para adquirir materiales nuevos, limitando su creatividad y capacidad para desarrollar proyectos innovadores y sostenibles.',
    },
    {
      title: 'Impacto Ambiental',
      description:
        'La industria textil es una de las más contaminantes del mundo, y la falta de sistemas de reciclaje eficientes agrava el problema de la contaminación ambiental.',
    },
    {
      title: 'Desconexión',
      description:
        'No existe una plataforma que conecte eficientemente la oferta de excedentes textiles con la demanda de materiales sostenibles, perdiendo oportunidades de economía circular.',
    },
  ];

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }

  trackByYear(_: number, item: TimelineItem): string {
    return item.year;
  }

  trackByTitle(_: number, item: ProblemItem): string {
    return item.title;
  }
}
