import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { TipoProyectoService } from '../../../services/tipo-proyecto-service';
import { TipoProyecto } from '../../../models/Tipo-proyecto';

@Component({
  standalone: true,
  selector: 'app-tipo-proyecto-listar',
  templateUrl: './tipo-proyecto-listar.html',
  styleUrl: './tipo-proyecto-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class TipoProyectoListarComponent implements OnInit {
  dataSource: MatTableDataSource<TipoProyecto> = new MatTableDataSource<TipoProyecto>();

  displayedColumns: string[] = ['idTipoProyecto', 'nombreTipoProyecto', 'acciones'];

  constructor(private tpS: TipoProyectoService) {}

  ngOnInit(): void {
    this.tpS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.tpS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este tipo de proyecto?')) return;

    this.tpS.delete(id).subscribe({
      next: () => {
        this.tpS.list().subscribe((data) => this.tpS.setList(data));
      },
      error: (err) => {
        if (err.status === 409) {
          alert(err.error);
        } else if (err.status === 404) {
          alert('El registro ya no existe (404).');
        } else {
          alert('Ocurrió un error al eliminar el tipo de proyecto.');
        }
      },
    });
  }
}
