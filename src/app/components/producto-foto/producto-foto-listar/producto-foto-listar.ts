import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ProductoFotoService } from '../../../services/producto-foto';
import { ProductoFoto } from '../../../models/producto-foto';

@Component({
  standalone: true,
  selector: 'app-producto-foto-listar',
  templateUrl: './producto-foto-listar.html',
  styleUrl: './producto-foto-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class ProductoFotoListarComponent implements OnInit {
  dataSource: MatTableDataSource<ProductoFoto> = new MatTableDataSource<ProductoFoto>();

  displayedColumns: string[] = [
    'idProductoFoto',
    'urlProductoFoto',
    'principalProductoFoto',
    'fechaSubidaProductoFoto',
    'producto',
    'acciones',
  ];

  constructor(private pfS: ProductoFotoService) {}

  ngOnInit(): void {
    this.pfS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.pfS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta foto?')) return;

    this.pfS.delete(id).subscribe(() => {
      this.pfS.list().subscribe((data) => this.pfS.setList(data));
    });
  }
}
