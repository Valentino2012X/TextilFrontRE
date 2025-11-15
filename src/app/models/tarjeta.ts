export class Tarjeta {
  idTarjeta?: number;
  aliasTarjeta!: string;
  tipoTarjeta!: string;
  ultimos4Tarjeta!: string;
  marcaTarjeta!: string;
  tokenReferenciaTarjeta!: string;
  vencimientoTarjeta!: string | Date;
  activaTarjeta!: boolean;
  fechaRegistroTarjeta!: string | Date;
  usuario?: {
    idUsuario: number;
    nombreUsuario?: string;
  };
}
