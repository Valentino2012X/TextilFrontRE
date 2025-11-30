import { Rol } from './Rol';

export class Usuario {
  idUsuario: number = 0;
  nombreUsuario: string = '';
  emailUsuario: string = '';
  username: string = '';
  password: string = '';
  telefonoUsuario: string = '';
  direccionUsuario: string = '';
  fechaRegistroUsuario: Date = new Date();
  enabled: boolean = true;

  // 🔹 Estos campos los calcula SIEMPRE el backend (solo lectura)
  promedioCalificacion?: number; // puede venir undefined si el backend lo omite en algún endpoint
  totalCalificacion?: number;

  rol: Rol = new Rol();
  nombreRol?: string;
}
