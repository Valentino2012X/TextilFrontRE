import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { PedidoItemService } from '../../../services/pedido-item-service';
import { PedidoItem } from '../../../models/Pedido-item';

@Component({
  standalone: true,
  selector: 'app-pedido-item-listar',
  templateUrl: './pedido-item-listar.html',
  styleUrl: './pedido-item-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class PedidoItemListarComponent implements OnInit {
  dataSource: MatTableDataSource<PedidoItem> =
    new MatTableDataSource<PedidoItem>();

  displayedColumns: string[] = [
    'idPedidoItem',
    'cantidadPedidoItem',
    'precioPedidoItem',
    'pedido',
    'producto',
    'acciones',
  ];

  constructor(private piS: PedidoItemService) {}

  ngOnInit(): void {
    this.piS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.piS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
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
}
