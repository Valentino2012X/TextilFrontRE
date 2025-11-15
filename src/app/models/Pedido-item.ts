// src/app/models/Pedido-item.ts
import { Pedido } from './Pedido';
import { Producto } from './Producto';

export class PedidoItem {
  idPedidoItem: number = 0;
  cantidadPedidoItem: number = 0;
  precioPedidoItem: number = 0;

  // IDs planos que vienen del DTO del backend
  idPedido?: number;
  idProducto?: number;

  // opcionalmente, los objetos completos si algún endpoint los manda
  pedido?: Pedido;
  producto?: Producto;
}