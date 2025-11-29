import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/enviroment';
import { Proyecto } from '../models/Proyecto';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  private url = `${base_url}/proyectos`;
  private listaCambio = new Subject<Proyecto[]>();

  constructor(private http: HttpClient) {}

  // GET /proyectos
  list() {
    return this.http.get<Proyecto[]>(this.url);
  }

  // POST /proyectos
  insert(body: any) {
    return this.http.post(this.url, body);
  }

  // GET /proyectos/{id}
  listId(id: number) {
    return this.http.get<Proyecto>(`${this.url}/${id}`);
  }

  // PUT /proyectos
  update(body: any) {
    return this.http.put(this.url, body, { responseType: 'text' });
  }

  // DELETE /proyectos/{id}
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  // SUBJECT PARA REFRESCAR TABLA
  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Proyecto[]) {
    this.listaCambio.next(listaNueva);
  }

  // GET /proyectos/rankingusuarios
  getUsuariosConMasProyectos() {
    return this.http.get<any[]>(`${this.url}/rankingusuarios`);
  }
}
