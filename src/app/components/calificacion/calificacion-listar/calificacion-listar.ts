// src/app/components/calificacion/calificacion-listar/calificacion-listar.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { CalificacionService } from '../../../services/calificacion';
import { Calificacion } from '../../../models/calificacion';

@Component({
  standalone: true,
  selector: 'app-calificacion-listar',
  templateUrl: './calificacion-listar.html',
  styleUrl: './calificacion-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class CalificacionListarComponent implements OnInit {
  dataSource: MatTableDataSource<Calificacion> =
    new MatTableDataSource<Calificacion>();

  displayedColumns: string[] = [
    'idCalificacion',
    'estrellas',
    'comentario',
    'fechaCalificacion',
    'pedido',
    'calificador',
    'calificado',
    'acciones',
  ];

  constructor(private cS: CalificacionService) {}

  ngOnInit(): void {
    this.cS.list().subscribe((data: Calificacion[]) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.cS.getList().subscribe((data: Calificacion[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta calificación?')) return;

    this.cS.delete(id).subscribe(() => {
      this.cS.list().subscribe((data: Calificacion[]) => {
        this.cS.setList(data);
      });
    });
  }
}
