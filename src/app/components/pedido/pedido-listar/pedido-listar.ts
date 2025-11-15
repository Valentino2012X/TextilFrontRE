import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { PedidoService } from '../../../services/pedido-service';
import { Pedido } from '../../../models/Pedido';

@Component({
  standalone: true,
  selector: 'app-pedido-listar',
  templateUrl: './pedido-listar.html',
  styleUrl: './pedido-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class PedidoListarComponent implements OnInit {
  dataSource: MatTableDataSource<Pedido> = new MatTableDataSource<Pedido>();

  displayedColumns: string[] = [
    'idPedido',
    'estadoPedido',
    'fechaCreacionPedido',
    'fechaPagoPedido',
    'totalPedido',
    'vendedor',
    'comprador',
    'metodoPago',
    'acciones',
  ];

  constructor(private pS: PedidoService) {}

  ngOnInit(): void {
    this.pS.list().subscribe((data: Pedido[]) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.pS.getList().subscribe((data: Pedido[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este pedido?')) return;

    this.pS.delete(id).subscribe({
      next: () => {
        this.pS.list().subscribe((data) => this.pS.setList(data));
      },
      error: (err) => {
        if (err.status === 404) {
          alert('El pedido ya no existe (404).');
        } else if (err.status === 409) {
          // mensaje que mandamos desde el backend
          alert(err.error);
        } else {
          alert('Ocurrió un error al eliminar el pedido.');
        }
      },
    });
  }
}
