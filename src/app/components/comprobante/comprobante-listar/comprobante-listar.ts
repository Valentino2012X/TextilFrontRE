import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ComprobanteService } from '../../../services/comprobante-service';
import { Comprobante } from '../../../models/Comprobante';

@Component({
  standalone: true,
  selector: 'app-comprobante-listar',
  templateUrl: './comprobante-listar.html',
  styleUrl: './comprobante-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class ComprobanteListarComponent implements OnInit {
  dataSource: MatTableDataSource<Comprobante> = new MatTableDataSource<Comprobante>();

  displayedColumns: string[] = [
    'idComprobante',
    'numeroComprobante',
    'fechaComprobante',
    'razonSocialComprobante',
    'igvComprobante',
    'totalComprobante',
    'pedido',
    'tipoDocumento',
    'acciones',
  ];

  constructor(private cS: ComprobanteService) {}

  ngOnInit(): void {
    // primera carga
    this.cS.list().subscribe((data: Comprobante[]) => {
      this.dataSource = new MatTableDataSource(data);
    });

    // refresco por Subject
    this.cS.getList().subscribe((data: Comprobante[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este comprobante?')) return;

    this.cS.delete(id).subscribe({
      next: () => {
        this.cS.list().subscribe((data: Comprobante[]) => this.cS.setList(data));
      },
      error: (err) => {
        if (err.status === 404) {
          alert('El comprobante ya no existe (404).');
        } else if (err.status === 409) {
          alert(err.error);
        } else {
          alert('Ocurrió un error al eliminar el comprobante.');
        }
      },
    });
  }
}
