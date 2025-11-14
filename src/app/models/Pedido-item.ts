import { Pedido } from './Pedido';
import { Producto } from './Producto';

export class PedidoItem {
  idPedidoItem: number = 0;
  cantidadPedidoItem: number = 0;
  precioPedidoItem: number = 0; // el backend lo maneja como BigDecimal
  pedido!: Pedido;              // siempre debe venir con pedido
  producto!: Producto;          // siempre debe venir con producto
}