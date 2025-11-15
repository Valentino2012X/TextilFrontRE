import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { MetodoPago } from '../../../models/Metodo-pago';
import { MetodoPagoService } from '../../../services/metodo-pago';

@Component({
  standalone: true,
  selector: 'app-metodo-pago-listar',
  templateUrl: './metodo-pago-listar.html',
  styleUrl: './metodo-pago-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class MetodoPagoListarComponent implements OnInit {
  dataSource: MatTableDataSource<MetodoPago> = new MatTableDataSource<MetodoPago>();

  displayedColumns: string[] = ['idMetodoPago', 'nombreMetodoPago', 'acciones'];

  constructor(private mS: MetodoPagoService) {}

  ngOnInit(): void {
    // carga inicial
    this.mS.list().subscribe((data: MetodoPago[]) => {
      this.dataSource = new MatTableDataSource(data);
    });

    // refresco cuando se llama setList()
    this.mS.getList().subscribe((data: MetodoPago[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.mS.delete(id).subscribe(() => {
      this.mS.list().subscribe((data: MetodoPago[]) => {
        this.mS.setList(data);
      });
    });
  }
}