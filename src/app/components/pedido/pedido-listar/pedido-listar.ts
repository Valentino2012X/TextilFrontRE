// src/app/components/pedido/pedido-listar/pedido-listar.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private pS: PedidoService, private router: Router) {}

  ngOnInit(): void {
    this.cargar();

    this.pS.getList().subscribe((data: Pedido[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  private cargar(): void {
    this.pS.list().subscribe((data: Pedido[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.pS.setList(data);
    });
  }

  // ✅ usado por el *ngIf del botón Pagar
  esPagado(estado: string | null | undefined): boolean {
    const e = (estado ?? '').trim().toUpperCase();
    return e === 'PAGADO' || e === 'APROBADO' || e === 'APPROVED';
  }

  // ✅ Navega a tu componente PayPal pasando query params correctos
  pagarConPaypal(row: Pedido): void {
    this.router.navigate(['/pago/paypal'], {
      queryParams: {
        pedidoId: row.idPedido, // 👈 OJO: pedidoId (tu pantalla lo espera así)
        total: row.totalPedido,
        descripcion: `Pedido #${row.idPedido}`,
      },
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este pedido?')) return;

    this.pS.delete(id).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        if (err.status === 404) {
          alert('El pedido ya no existe (404).');
        } else if (err.status === 409) {
          alert(err.error);
        } else {
          alert('Ocurrió un error al eliminar el pedido.');
        }
      },
    });
  }
}
