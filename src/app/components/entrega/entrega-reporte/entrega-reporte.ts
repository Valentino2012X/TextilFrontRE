import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntregaService } from '../../../services/entrega-service';
import { Chart, ChartConfiguration, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-entrega-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrega-reporte.html',
  styleUrls: ['./entrega-reporte.css']
})
export class EntregaReporteComponent implements OnInit {

  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  pieChart: Chart<'pie', number[], string> | undefined;

  inicio: string = '';
  fin: string = '';
  totales: number = 0;
  canceladas: number = 0;

  constructor(private entregaService: EntregaService) {}

  ngOnInit(): void {}

  buscar(): void {
    if (!this.inicio || !this.fin) {
      alert('Debes ingresar ambas fechas');
      return;
    }

    this.entregaService.resumenPorRango(this.inicio, this.fin).subscribe({
      next: (data: any) => {
        this.totales = data.totales;
        this.canceladas = data.canceladas;
        this.createChart();
      },
      error: err => {
        console.error('Error al obtener datos', err);
      }
    });
  }

  createChart(): void {
    if (!this.pieCanvas || this.totales === 0) return;

    if (this.pieChart) this.pieChart.destroy();

    const config: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: {
        labels: ['Entregas completadas', 'Entregas canceladas'],
        datasets: [{
          data: [this.totales - this.canceladas, this.canceladas],
          backgroundColor: ['#4CAF50', '#FF6384']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: { enabled: true }
        }
      }
    };

    this.pieChart = new Chart(this.pieCanvas.nativeElement, config);
  }
}
