// src/app/components/producto-foto/producto-foto-listar/producto-foto-listar.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { ProductoFotoService } from '../../../services/producto-foto';
import { ProductoFoto } from '../../../models/producto-foto';

@Component({
  standalone: true,
  selector: 'app-producto-foto-listar',
  templateUrl: './producto-foto-listar.html',
  styleUrl: './producto-foto-listar.css',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, RouterLink],
})
export class ProductoFotoListarComponent implements OnInit {
  fotos: ProductoFoto[] = [];
  total: number = 0;

  constructor(private pfS: ProductoFotoService) {}

  ngOnInit(): void {
    this.pfS.list().subscribe((data) => {
      this.fotos = data;
      this.total = data.length;
    });

    this.pfS.getList().subscribe((data) => {
      this.fotos = data;
      this.total = data.length;
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta foto?')) return;

    this.pfS.delete(id).subscribe(() => {
      this.pfS.list().subscribe((data) => this.pfS.setList(data));
    });
  }

  getNombreProducto(f: ProductoFoto): string {
    return f.producto?.nombreProducto || 'Producto sin nombre';
  }
}