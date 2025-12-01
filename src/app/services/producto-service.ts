import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/Producto';
import { Subject } from 'rxjs';
import { environment } from '../../environments/enviroment';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private url = `${base_url}/productos`;

  private listaCambio = new Subject<Producto[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<any[]>(this.url);
  }

  insert(body: any) {
    return this.http.post(this.url, body);
  }

  listId(id: number) {
    return this.http.get<any>(`${this.url}/${id}`);
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

  setList(listaNueva: Producto[]) {
    this.listaCambio.next(listaNueva);
  }
  getProductosPorRangoPrecio(min: number, max: number) {
  return this.http.get<Producto[]>(
  `${this.url}/bprecio?min=${min}&max=${max}`);
  }
}
