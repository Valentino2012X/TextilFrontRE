import { Proyecto } from './proyecto';
import { Usuario } from './Usuario';

export class ComentarioProyecto {
  idComentarioProyecto?: number;
  comentarioProyecto: string = '';
  // viene del backend como string ISO (LocalDateTime)
  fechaComentario?: string;
  proyecto?: Proyecto;
  usuario?: Usuario;
}
