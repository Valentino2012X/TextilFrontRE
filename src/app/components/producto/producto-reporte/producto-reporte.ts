import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { ProductoService } from '../../../services/producto-service';

@Component({
  selector: 'app-reporteprecio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    BaseChartDirective,
  ],
  templateUrl: './producto-reporte.html',
  styleUrl: './producto-reporte.css',
  providers: [provideCharts(withDefaultRegisterables())],
})
export class ReportePrecio {
  hasData = false;

  dataSource: any[] = [];
  displayedColumns: string[] = [
    'idProducto',
    'nombreProducto',
    'precioProducto',
    'stockProducto',
    'nombreTipoProducto',
  ];

  minPrice = 0;
  maxPrice = 0;

  // ✅ literal exacto (evita el error de typings)
  barChartType = 'bar' as const;

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };

  constructor(private pS: ProductoService) {}

  buscar() {
    if (this.minPrice == null || this.maxPrice == null) return;

    this.pS.getProductosPorRangoPrecio(this.minPrice, this.maxPrice).subscribe((data: any[]) => {
      this.dataSource = data ?? [];
      this.hasData = this.dataSource.length > 0;

      if (this.hasData) {
        this.barChartData = {
          labels: this.dataSource.map((x) => x.nombreProducto),
          datasets: [
            {
              data: this.dataSource.map((x) => x.precioProducto),
              label: 'Precio de productos',
            },
          ],
        };
      } else {
        this.barChartData = { labels: [], datasets: [] };
      }
    });
  }
}
