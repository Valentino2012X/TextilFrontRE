import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ComprobanteService } from '../../../services/comprobante-service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-comprobante-reporte',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './comprobante-reporte.html',
  styleUrls: ['./comprobante-reporte.css']
})
export class ComprobanteReporteComponent implements OnInit {
  inicio: Date | null = null;
  fin: Date | null = null;

  hasData: boolean = false;
  comprobantes = new MatTableDataSource<any>([]);

  displayedColumns: string[] = ['id', 'fecha', 'username'];

  constructor(private comprobanteService: ComprobanteService) {}

  ngOnInit(): void {}

  buscar(): void {
    if (!this.inicio || !this.fin) {
      alert('Debes ingresar ambas fechas');
      return;
    }

    // Convertir fechas a string si el servicio espera string
    const inicioStr = this.inicio.toISOString().split('T')[0];
    const finStr = this.fin.toISOString().split('T')[0];

    this.comprobanteService.searchByRangoFechas(inicioStr, finStr)
      .subscribe(data => {
        this.comprobantes.data = data;
        this.hasData = data.length > 0;
      });
  }
}
