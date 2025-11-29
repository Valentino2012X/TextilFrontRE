import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { ComentarioProyectoService } from '../../../services/comentario-proyecto-service';

@Component({
  selector: 'app-reporte-comentarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comentario-proyecto-reporte.html',
  styleUrls: ['./comentario-proyecto-reporte.css']
})
export class ReporteComentarios implements OnInit {

  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  hasData = false;
  pieChart: Chart | undefined;

  chartData: number[] = [];
  chartLabels: string[] = [];

  constructor(private cS: ComentarioProyectoService) {}

  ngOnInit(): void {
    this.cS.getCantidadPorProyecto().subscribe(data => {
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

  createChart() {
    if (!this.pieCanvas || this.chartData.length === 0) return;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
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
    });
  }
}
