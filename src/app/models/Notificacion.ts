import { Usuario } from './Usuario';

export class Notificacion {
  idNotificacion: number = 0;
  tipoNotificacion: string = '';
  mensajeNotificacion: string = '';
  fechaNotificacion: Date = new Date();
  usuario: Usuario = new Usuario();
}
