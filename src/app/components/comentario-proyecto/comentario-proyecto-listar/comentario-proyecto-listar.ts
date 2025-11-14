import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ComentarioProyectoService } from '../../../services/comentario-proyecto-service';
import { ComentarioProyecto } from '../../../models/comentario-proyecto';

@Component({
  standalone: true,
  selector: 'app-comentario-proyecto-listar',
  templateUrl: './comentario-proyecto-listar.html',
  styleUrl: './comentario-proyecto-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class ComentarioProyectoListarComponent implements OnInit {
  dataSource: MatTableDataSource<ComentarioProyecto> = new MatTableDataSource<ComentarioProyecto>();

  displayedColumns: string[] = [
    'idComentarioProyecto',
    'comentarioProyecto',
    'fechaComentario',
    'proyecto',
    'usuario',
    'acciones',
  ];

  constructor(private cS: ComentarioProyectoService) {}

  ngOnInit(): void {
    this.cS.list().subscribe((data: ComentarioProyecto[]) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.cS.getList().subscribe((data: ComentarioProyecto[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este comentario?')) return;

    this.cS.delete(id).subscribe({
      next: () => {
        this.cS.list().subscribe((data) => this.cS.setList(data));
      },
      error: (err) => {
        if (err.status === 404) {
          alert('El registro ya no existe (404).');
        } else {
          alert('Ocurrió un error al eliminar el comentario.');
        }
      },
    });
  }
}
