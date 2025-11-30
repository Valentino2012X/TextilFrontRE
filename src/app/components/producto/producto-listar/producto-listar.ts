import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { ProductoService } from '../../../services/producto-service';
import { LoginService } from '../../../services/login-service';

@Component({
  standalone: true,
  selector: 'app-producto-listar',
  templateUrl: './producto-listar.html',
  styleUrl: './producto-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink, MatCardModule],
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

  constructor(
    private pS: ProductoService,
    private loginService: LoginService
  ) {}

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

  // ==== Banderas por rol (para el HTML) ====
  get isAdmin(): boolean {
    return this.loginService.hasAnyRole('ADMIN');
  }
  get isVendedor(): boolean {
    return this.loginService.hasAnyRole('VENDEDOR');
  }
  get isComprador(): boolean {
    return this.loginService.hasAnyRole('ESTUDIANTE');
  }
}
