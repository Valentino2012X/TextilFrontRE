// src/app/components/entrega/entrega-listar/entrega-listar.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { EntregaService } from '../../../services/entrega-service';
import { Entrega } from '../../../models/Entrega';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-entrega-listar',
  templateUrl: './entrega-listar.html',
  styleUrl: './entrega-listar.css',
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
})
export class EntregaListarComponent implements OnInit {
  dataSource: MatTableDataSource<Entrega> =
    new MatTableDataSource<Entrega>();

  displayedColumns: string[] = [
    'idEntrega',
    'tipoEntrega',
    'direccionEntrega',
    'fechaEntrega',
    'estadoEntrega',
    'pedido',
    'acciones',
  ];

  constructor(private eS: EntregaService, private router: Router) {}

  ngOnInit(): void {
    this.eS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.eS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  editar(row: Entrega): void {
    this.router.navigate(['entrega/edit', row.idEntrega]);
  }

  eliminar(id: number): void {
    const confirmar = confirm(
      '¿Seguro que deseas eliminar esta entrega?'
    );
    if (!confirmar) {
      return;
    }

    this.eS.delete(id).subscribe({
      next: () => {
        this.eS.list().subscribe((data) => this.eS.setList(data));
      },
      error: () => {
        alert('Ocurrió un error al eliminar la entrega.');
      },
    });
  }
}
