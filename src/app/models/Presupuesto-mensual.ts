import { Usuario } from './Usuario';

export class PresupuestoMensual {
  idPresupuestoMensual: number = 0;
  anioPresupuestoMensual: number = new Date().getFullYear();
  mesPresupuestoMensual: number = new Date().getMonth() + 1;
  montoLimitePresupuestoMensual: number = 0;
  // el backend manda LocalDate, aquí lo manejamos como string ISO (yyyy-MM-dd)
  fechaPresupuestoMensual: string = '';
  usuario: Usuario = new Usuario();
}
