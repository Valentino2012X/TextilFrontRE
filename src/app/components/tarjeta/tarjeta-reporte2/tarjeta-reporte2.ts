import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarjetaService } from '../../../services/tarjeta';


@Component({
  selector: 'app-tarjeta-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarjeta-reporte2.html',
  styleUrls: ['./tarjeta-reporte2.css']
})
export class TarjetaReporteComponent implements OnInit {

  inicio: string = '';
  fin: string = '';
  tarjetas: any[] = [];
  hasData: boolean = false;

  constructor(private tarjetaService: TarjetaService) {}

  ngOnInit(): void {}

  buscar(): void {
    if (!this.inicio || !this.fin) {
      alert('Debes ingresar ambas fechas');
      return;
    }

    this.tarjetaService.buscarPorVencimiento(this.inicio, this.fin).subscribe({
      next: (data: any[]) => {
        this.tarjetas = data;
        this.hasData = data.length > 0;
      },
      error: err => {
        console.error('Error al obtener tarjetas', err);
        this.hasData = false;
      }
    });
  }
}
