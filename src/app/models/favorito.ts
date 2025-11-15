// src/app/models/Favorito.ts
export class Favorito {
  idFavorito: number = 0;
  // El backend usa LocalDate -> lo manejamos como string 'yyyy-MM-dd'
  fechaFavorito: string = '';

  // El backend manda objetos Usuario/Producto/Proyecto (al menos con id)
  usuario: { idUsuario: number; nombreUsuario?: string } = { idUsuario: 0 };
  producto: { idProducto: number; nombreProducto?: string } = { idProducto: 0 };
  proyecto: { idProyecto: number; nombreProyecto?: string } = { idProyecto: 0 };
}
