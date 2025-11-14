import { TipoProducto } from './Tipo-producto';
import { Usuario } from './Usuario';

export class Producto {
  idProducto: number = 0;
  nombreProducto: string = "";
  descripcionProducto: string = "";
  precioProducto: number = 0;
  stockProducto: number = 0;
  colorProducto: string = "";
  medidaProducto: string = "";
  categoriaProducto: string = "";
  disponibleProducto: boolean = true;
  urlTipoProducto: string = "";
  tipoProducto!: TipoProducto;
  usuario!: Usuario;
}