import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoProducto } from '../models/Tipo-producto';
import { Subject } from 'rxjs';
import { environment } from '../../environments/enviroment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class TipoProductoService {
  private url = `${base_url}/tiposproductos`;
  private listaCambio = new Subject<TipoProducto[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<TipoProducto[]>(`${this.url}/listar`);
  }

  insert(body: any) {
    return this.http.post(this.url, body);
  }

  listId(id: number) {
    return this.http.get<TipoProducto>(`${this.url}/${id}`);
  }

  update(body: any) {
    return this.http.put(this.url, body, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: TipoProducto[]) {
    this.listaCambio.next(listaNueva);
  }
}
