// src/app/models/comprobante.ts
import { Pedido } from './Pedido';
import { TipoDocumento } from './Tipo-documento';

export class Comprobante {
  idComprobante!: number;
  numeroComprobante!: string;
  fechaComprobante!: string; // o Date, como prefieras
  razonSocialComprobante!: string;
  igvComprobante!: number;
  totalComprobante!: number;

  // lo que manda el backend ahora
  idPedido?: number;
  idTipoDocumento?: number;
  nombreTipoDocumento?: string;

  // por si en algún momento usas forma anidada
  pedido?: Pedido;
  tipoDocumento?: TipoDocumento;
}
