import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { TipoDocumento } from '../../../models/Tipo-documento';
import { TipoDocumentoService } from '../../../services/tipo-documento-service';

@Component({
  standalone: true,
  selector: 'app-tipo-documento-listar',
  templateUrl: './tipo-documento-listar.html',
  styleUrl: './tipo-documento-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class TipoDocumentoListarComponent implements OnInit {
  dataSource: MatTableDataSource<TipoDocumento> =
    new MatTableDataSource<TipoDocumento>();

  displayedColumns: string[] = [
    'idTipoDocumento',
    'nombre',
    'descripcionTipoDocumento',
    'rucTipoDocumento',
    'acciones',
  ];

  constructor(private tdS: TipoDocumentoService) {}

  ngOnInit(): void {
    // carga inicial
    this.tdS.list().subscribe((data: TipoDocumento[]) => {
      this.dataSource = new MatTableDataSource(data);
    });

    // refresco cuando se llama setList()
    this.tdS.getList().subscribe((data: TipoDocumento[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este tipo de documento?')) return;

    this.tdS.delete(id).subscribe({
      next: () => {
        this.tdS.list().subscribe((data: TipoDocumento[]) => {
          this.tdS.setList(data);
        });
      },
      error: (err) => {
        if (err.status === 404) {
          alert('El registro ya no existe (404).');
        } else if (err.status === 409) {
          alert(err.error);
        } else {
          alert('Ocurrió un error al eliminar el tipo de documento.');
        }
      },
    });
  }
}
