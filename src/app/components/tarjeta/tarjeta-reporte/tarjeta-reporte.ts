import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, PieController, ArcElement, Legend, Tooltip } from 'chart.js';
import { CommonModule } from '@angular/common';
import { TarjetaService } from '../../../services/tarjeta';

Chart.register(PieController, ArcElement, Legend, Tooltip);

@Component({
  selector: 'app-reporte-tarjetas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-reporte.html',
  styleUrls: ['./tarjeta-reporte.css']
})
export class ReporteTarjetas implements OnInit {

  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  hasData = false;
  pieChart: Chart<'pie', number[], string> | undefined;

  chartData: number[] = [];
  chartLabels: string[] = [];

  constructor(private tS: TarjetaService) {}

  ngOnInit(): void {
    this.tS.getCantidadPorMarca().subscribe(data => {
      if (data.length > 0) {
        this.hasData = true;

        this.chartLabels = data.map(item => item[0] as string);
        this.chartData = data.map(item => item[1] as number);

        setTimeout(() => this.createChart(), 0);
      } else {
        this.hasData = false;
      }
    });
  }

  createChart(): void {
    if (!this.pieCanvas || this.chartData.length === 0) return;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const config: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: {
        labels: this.chartLabels,
        datasets: [{
          data: this.chartData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    };

    this.pieChart = new Chart(this.pieCanvas.nativeElement, config);
  }
}
