import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { TarjetaService } from '../../../services/tarjeta';
import { Tarjeta } from '../../../models/tarjeta';

@Component({
  standalone: true,
  selector: 'app-tarjeta-listar',
  templateUrl: './tarjeta-listar.html',
  styleUrl: './tarjeta-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class TarjetaListarComponent implements OnInit {
  dataSource: MatTableDataSource<Tarjeta> = new MatTableDataSource<Tarjeta>();

  displayedColumns: string[] = [
    'idTarjeta',
    'aliasTarjeta',
    'tipoTarjeta',
    'marcaTarjeta',
    'ultimos4Tarjeta',
    'vencimientoTarjeta',
    'activaTarjeta',
    'usuario',
    'acciones',
  ];

  constructor(private tS: TarjetaService) {}

  ngOnInit(): void {
    this.tS.list().subscribe((data: Tarjeta[]) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.tS.getList().subscribe((data: Tarjeta[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta tarjeta?')) return;

    this.tS.delete(id).subscribe(() => {
      this.tS.list().subscribe((data: Tarjeta[]) => {
        this.tS.setList(data);
      });
    });
  }
}
