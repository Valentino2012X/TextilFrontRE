// src/app/models/Calificacion.ts
import { Pedido } from './Pedido';
import { Usuario } from './Usuario';

export class Calificacion {
  idCalificacion!: number;
  estrellas!: number;
  comentario!: string;
  fechaCalificacion!: Date | string;

  pedido?: Pedido;
  calificador?: Usuario;
  calificado?: Usuario;
}
