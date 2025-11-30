import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/enviroment';
import { ComentarioProyecto } from '../models/Comentario-proyecto';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ComentarioProyectoService {
  private url = `${base_url}/comentariosproyectos`;
  private listaCambio = new Subject<ComentarioProyecto[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<ComentarioProyecto[]>(this.url);
  }

  insert(body: any) {
    return this.http.post(this.url, body);
  }

  // usamos PUT /comentariosproyectos/{id}
  update(id: number, body: any) {
    return this.http.put(`${this.url}/${id}`, body, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: ComentarioProyecto[]) {
    this.listaCambio.next(listaNueva);
  }

  // opcional: solo si quieres usar el endpoint /proyecto/{idProyecto}
  listByProyecto(idProyecto: number) {
    return this.http.get<ComentarioProyecto[]>(`${this.url}/proyecto/${idProyecto}`);
  }
  getCantidadPorProyecto() {
  return this.http.get<any[]>(`${this.url}/comentarios/proyectos`);
}
}