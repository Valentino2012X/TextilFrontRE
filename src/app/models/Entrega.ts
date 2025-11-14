// src/app/models/entrega.ts
import { Pedido } from './Pedido';

export class Entrega {
  idEntrega: number = 0;
  tipoEntrega: string = '';
  direccionEntrega: string = '';
  latitudEntrega: number = 0;
  longitudEntrega: number = 0;
  fechaEntrega: Date = new Date();
  estadoEntrega: string = '';
  pedido: Pedido = new Pedido();
}
