import { Producto } from './Producto';

export class ProductoFoto {
  idProductoFoto: number = 0;
  urlProductoFoto: string = '';
  principalProductoFoto: boolean = false;
  fechaSubidaProductoFoto?: Date;
  producto?: Producto;
}
