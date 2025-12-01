// src/app/components/pago/pago-paypal/pago-paypal.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type EstadoUI = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ERROR';

declare global {
  interface Window { paypal: any; }
}

@Component({
  standalone: true,
  selector: 'app-pago-paypal',
  templateUrl: './pago-paypal.html',
  styleUrl: './pago-paypal.css',
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
})
export class PagoPaypalComponent implements OnInit {
  pedidoId: number = 0;
  total: number = 0;
  descripcion: string = '';

  estado: EstadoUI = 'PENDING';
  mensaje: string = 'Completa el pago con PayPal (sandbox).';

  private rendered = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((q) => {
      this.pedidoId = Number(q['pedidoId'] ?? 0);     // 👈 clave: pedidoId
      this.total = Number(q['total'] ?? 0);
      this.descripcion = String(q['descripcion'] ?? `Pedido #${this.pedidoId}`);

      if (!this.pedidoId || !this.total) {
        this.estado = 'ERROR';
        this.mensaje = 'Faltan parámetros (pedidoId/total). Vuelve a Pedidos e intenta de nuevo.';
        return;
      }

      // render 1 sola vez
      queueMicrotask(() => this.renderPaypal());
    });
  }

  reiniciar(): void {
    this.estado = 'PENDING';
    this.mensaje = 'Completa el pago con PayPal (sandbox).';
    this.rendered = false;
    queueMicrotask(() => this.renderPaypal());
  }

  volverPedidos(): void {
    this.router.navigate(['/pedido']);
  }

  private renderPaypal(): void {
    if (this.estado !== 'PENDING') return;

    const container = document.getElementById('paypal-buttons');
    if (!container) return;

    // re-render limpio
    container.innerHTML = '';

    if (!window.paypal) {
      this.estado = 'ERROR';
      this.mensaje = 'No cargó el SDK de PayPal. Revisa tu index.html (script de PayPal).';
      return;
    }

    if (this.rendered) return;
    this.rendered = true;

    window.paypal.Buttons({
      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              description: this.descripcion,
              amount: {
                currency_code: 'USD',
                value: this.total.toFixed(2),
              },
            },
          ],
        });
      },

      onApprove: async (_data: any, actions: any) => {
        try {
          await actions.order.capture();
          this.estado = 'APPROVED';
          this.mensaje = 'Pago aprobado ✅ (sandbox). Ya puedes volver a Pedidos.';
        } catch (e) {
          this.estado = 'ERROR';
          this.mensaje = 'Error capturando el pago (approve).';
        }
      },

      onCancel: () => {
        this.estado = 'REJECTED';
        this.mensaje = 'Pago cancelado por el usuario.';
      },

      onError: () => {
        this.estado = 'ERROR';
        this.mensaje = 'Ocurrió un error con PayPal.';
      },
    }).render('#paypal-buttons');
  }
}
