import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ProductoService } from '../../../services/producto-service';

@Component({
  standalone: true,
  selector: 'app-producto-listar',
  templateUrl: './producto-listar.html',
  styleUrl: './producto-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class ProductoListarComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'idProducto',
    'nombreProducto',
    'precioProducto',
    'stockProducto',
    'nombreTipoProducto',
    'nombreUsuario',
    'acciones',
  ];

  constructor(private pS: ProductoService) {}

  ngOnInit(): void {
    this.pS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.pS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

    this.pS.delete(id).subscribe({
      next: () => {
        this.pS.list().subscribe((data) => {
          this.pS.setList(data);
        });
      },
      error: (err) => {
        if (err.status === 409) {
          alert(err.error);
        } else {
          alert('Ocurrió un error al eliminar el producto.');
        }
      },
    });
  }
}
