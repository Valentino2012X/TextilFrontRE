import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ProyectoService } from '../../../services/proyecto-service';
import { Proyecto } from '../../../models/proyecto';

@Component({
  standalone: true,
  selector: 'app-proyecto-listar',
  templateUrl: './proyecto-listar.html',
  styleUrl: './proyecto-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class ProyectoListarComponent implements OnInit {
  dataSource: MatTableDataSource<Proyecto> = new MatTableDataSource<Proyecto>();

  displayedColumns: string[] = [
    'idProyecto',
    'tituloProyecto',
    'fechaCreacion',
    'tipoProyecto',
    'usuario',
    'acciones',
  ];

  constructor(private pS: ProyectoService) {}

  ngOnInit(): void {
    this.pS.list().subscribe((data: Proyecto[]) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.pS.getList().subscribe((data: Proyecto[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este proyecto?')) return;

    this.pS.delete(id).subscribe({
      next: () => {
        this.pS.list().subscribe((data: Proyecto[]) => this.pS.setList(data));
      },
      error: (err) => {
        if (err.status === 404) {
          alert('El registro ya no existe (404).');
        } else if (err.status === 409) {
          alert(err.error);
        } else {
          alert('Ocurrió un error al eliminar el proyecto.');
        }
      },
    });
  }
}
