import { Usuario } from './Usuario';
import { MetodoPago } from './Metodo-pago';

export class Pedido {
  idPedido: number = 0;
  estadoPedido: string = '';
  fechaCreacionPedido: string = ''; // lo recibimos como string ISO (yyyy-MM-dd)
  fechaPagoPedido: string = '';
  totalPedido: number = 0;

  vendedor: Usuario = new Usuario();
  comprador: Usuario = new Usuario();
  metodoPago: MetodoPago = new MetodoPago();
}