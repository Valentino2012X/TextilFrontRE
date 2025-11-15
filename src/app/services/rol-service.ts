import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rol } from '../models/Rol';
import { Subject } from 'rxjs';
import { environment } from '../../environments/enviroment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private url = `${base_url}/roles`;

  private listaCambio = new Subject<Rol[]>();

  constructor(private http: HttpClient) {}

  // LISTAR (devuelve JSON, está bien así)
  list() {
    return this.http.get<Rol[]>(this.url);
  }

  // INSERTAR -> el backend devuelve String, así que pedimos 'text'
  insert(rol: Rol) {
    return this.http.post<string>(this.url, rol, {
      responseType: 'text' as 'json',
    });
  }

  // OBTENER POR ID (devuelve JSON, está bien así)
  listId(id: number) {
    return this.http.get<Rol>(`${this.url}/${id}`);
  }

  // ACTUALIZAR -> también devuelve String
  update(rol: Rol) {
    return this.http.put<string>(this.url, rol, {
      responseType: 'text' as 'json',
    });
  }

  // ELIMINAR -> ya lo tenías como text, lo unificamos
  delete(id: number) {
    return this.http.delete<string>(`${this.url}/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Rol[]) {
    this.listaCambio.next(listaNueva);
  }
}
