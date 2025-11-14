export class Proyecto {
  idProyecto: number = 0;
  tituloProyecto: string = '';
  descripcionProyecto: string = '';
  urlProyecto: string = '';
  visibleProyecto: string = '';
  fechaCreacion: Date = new Date();

  // OJO: ahora son strings simples, no objetos
  tipoProyecto: string = ''; // nombre del tipo de proyecto
  usuario: string = '';      // nombre del usuario
}
