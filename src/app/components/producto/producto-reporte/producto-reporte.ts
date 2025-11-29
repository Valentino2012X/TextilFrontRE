import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../services/producto-service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporteprecio',
  imports: [BaseChartDirective, MatIconModule, FormsModule,MatTableModule,CommonModule],
  templateUrl: './producto-reporte.html',
  styleUrl: './producto-reporte.css',
  providers: [provideCharts(withDefaultRegisterables())],
})
export class ReportePrecio implements OnInit {
  hasData = false;

dataSource: any[] = [];
displayedColumns: string[] = [  'idProducto','nombreProducto','precioProducto','stockProducto','nombreTipoProducto'];

  minPrice: number = 0;
  maxPrice: number = 0;

  barChartOptions: ChartOptions = { responsive: true };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];

  constructor(private pS: ProductoService) {}

  ngOnInit(): void {
  }

buscar() {
  if (this.minPrice == null || this.maxPrice == null) return;

  this.pS.getProductosPorRangoPrecio(this.minPrice, this.maxPrice)
    .subscribe(data => {
      this.dataSource = data;

      if (data.length > 0) {
        this.hasData = true;

        this.barChartLabels = data.map(item => item.nombreProducto);

        this.barChartData = [
          {
            data: data.map(item => item.precioProducto),
            label: 'Precio de productos',
            backgroundColor: ['#75ddfc', '#aeacf7', '#fc9d75']
          }
        ];

      } else {
        this.hasData = false;
      }
    });
}
}
