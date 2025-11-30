import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { ComprobanteService } from '../../../services/comprobante-service';
import { PedidoService } from '../../../services/pedido-service';
import { MatIconModule } from '@angular/material/icon';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

@Component({
  selector: 'app-pedido-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule,MatIconModule,],
  templateUrl: './pedido-reporte.html',
  styleUrls: ['./pedido-reporte.css']
})
export class PedidoReporte implements OnInit {

  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  barChart: Chart<'bar', number[], string> | undefined;

  fecha: string = '';
  hasData = false;
  chartData: number[] = [];
  chartLabels: string[] = [];

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {}

  buscar(): void {
    if (!this.fecha) {
      alert('Debes seleccionar una fecha');
      return;
    }

    this.pedidoService.sumarTotalPorFecha(this.fecha)
      .subscribe(data => {
        this.hasData = true;
        this.chartLabels = ['Total'];
        this.chartData = [data.total];
        setTimeout(() => this.createChart(), 0);
      });
  }

  createChart(): void {
    if (!this.barCanvas) return;

    if (this.barChart) this.barChart.destroy();

    const config: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: `El total de soles para ${this.fecha}`,
          data: this.chartData,
          backgroundColor: '#36A2EB'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: { enabled: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    };

    this.barChart = new Chart(this.barCanvas.nativeElement, config);
  }
}