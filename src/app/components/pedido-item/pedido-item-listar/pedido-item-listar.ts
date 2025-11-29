// src/app/components/pedido-item/pedido-item-listar/pedido-item-listar.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { PedidoItemService } from '../../../services/pedido-item-service';
import { PedidoItem } from '../../../models/Pedido-item';
import { MatHeaderCellDef, MatCellDef } from "@angular/material/table";

@Component({
  standalone: true,
  selector: 'app-pedido-item-listar',
  templateUrl: './pedido-item-listar.html',
  styleUrl: './pedido-item-listar.css',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, RouterLink, MatHeaderCellDef, MatCellDef],
})
export class PedidoItemListarComponent implements OnInit {
  items: PedidoItem[] = [];
  total: number = 0;

  constructor(private piS: PedidoItemService) {}

  ngOnInit(): void {
    this.piS.list().subscribe((data) => {
      this.items = data;
      this.total = data.length;
    });

    this.piS.getList().subscribe((data) => {
      this.items = data;
      this.total = data.length;
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este ítem de pedido?')) {
      return;
    }

    this.piS.delete(id).subscribe({
      next: () => {
        this.piS.list().subscribe((data) => this.piS.setList(data));
      },
      error: (err) => {
        if (err.status === 409) {
          alert(err.error);
        } else if (err.status === 404) {
          alert('El registro ya no existe (404).');
        } else {
          alert('Ocurrió un error al eliminar el ítem.');
        }
      },
    });
  }

  getNombreProducto(row: PedidoItem): string {
    return row.nombreProducto || 'Producto sin nombre';
  }
}