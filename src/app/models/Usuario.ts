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
  promedioCalificacion: number = 0;
  totalCalificacion: number = 0;
  rol: Rol = new Rol();   // 👈 para mostrar rol.nombreRol al listar
  nombreRol?: string;
}
