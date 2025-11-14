import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { TipoProductoService } from '../../../services/tipo-producto-service';
import { TipoProducto } from '../../../models/Tipo-producto';

@Component({
  standalone: true,
  selector: 'app-tipo-producto-listar',
  templateUrl: './tipo-producto-listar.html',
  styleUrl: './tipo-producto-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class TipoProductoListarComponent implements OnInit {
  dataSource: MatTableDataSource<TipoProducto> = new MatTableDataSource<TipoProducto>();

  displayedColumns: string[] = [
    'idTipoProducto',
    'nombreTipoProducto',
    'acciones'
  ];

  constructor(private tS: TipoProductoService) {}

  ngOnInit(): void {
    this.tS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.tS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este tipo de producto?')) {
      return;
    }

    this.tS.delete(id).subscribe({
      next: () => {
        // Refrescamos la lista
        this.tS.list().subscribe((data) => {
          this.tS.setList(data);
        });
      },
      error: (err) => {
        // 👇 Aquí manejamos el 409 y otros errores
        if (err.status === 409) {
          alert(err.error); // "No se puede eliminar porque está asociado a productos."
        } else if (err.status === 404) {
          alert('El registro ya no existe (404).');
        } else {
          alert('Ocurrió un error al eliminar. Inténtalo nuevamente.');
        }
      },
    });
  }
}
