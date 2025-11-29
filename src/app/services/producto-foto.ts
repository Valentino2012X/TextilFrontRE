import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/enviroment';
import { ProductoFoto } from '../models/producto-foto';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ProductoFotoService {
  private url = `${base_url}/productosfotos`;
  private listaCambio = new Subject<ProductoFoto[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<ProductoFoto[]>(this.url);
  }

  insert(body: any) {
    return this.http.post(this.url, body); // si el back devuelve String, puedes agregar responseType
  }

  listId(id: number) {
    return this.http.get<ProductoFoto>(`${this.url}/${id}`);
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

  setList(listaNueva: ProductoFoto[]) {
    this.listaCambio.next(listaNueva);
  }
}
