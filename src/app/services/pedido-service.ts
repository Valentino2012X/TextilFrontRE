import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Pedido } from '../models/Pedido';
import { environment } from '../../environments/enviroment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private url = `${base_url}/pedidos`;
  private listaCambio = new Subject<Pedido[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Pedido[]>(this.url);
  }

  insert(body: any) {
    return this.http.post(this.url, body);
  }

  listId(id: number) {
    return this.http.get<Pedido>(`${this.url}/${id}`);
  }

  update(body: any) {
    // requiere @PutMapping en PedidoController
    return this.http.put(this.url, body, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Pedido[]) {
    this.listaCambio.next(listaNueva);
  }

  // GET /pedidos/total?fecha=YYYY-MM-DD
  sumarTotalPorFecha(fecha: string) {
    return this.http.get<{ fecha: string; total: number }>(`${this.url}/total`, {
      params: { fecha },
    });
  }
}
