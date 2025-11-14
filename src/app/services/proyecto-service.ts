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

  // LISTAR
  list() {
    return this.http.get<Proyecto[]>(this.url);
  }

  // OBTENER POR ID
  listId(id: number) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  // INSERTAR
  insert(proyecto: Proyecto) {
    return this.http.post<string>(this.url, proyecto, {
      responseType: 'text' as 'json',
    });
  }

  // ACTUALIZAR
  update(proyecto: Proyecto) {
    return this.http.put<string>(this.url, proyecto, {
      responseType: 'text' as 'json',
    });
  }

  // ELIMINAR
  delete(id: number) {
    return this.http.delete<string>(`${this.url}/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  // SUBJECT PARA REFRESCAR TABLA
  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Proyecto[]) {
    this.listaCambio.next(listaNueva);
  }
}
