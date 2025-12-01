import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/enviroment';
import { Pedido } from '../models/Pedido';

const base_url = environment.apiUrl;

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
    // necesitas agregar un @PutMapping en tu PedidoController
    return this.http.put(this.url, body, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      responseType: 'text' as 'json', // para no intentar parsear JSON
    });
  }
  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Pedido[]) {
    this.listaCambio.next(listaNueva);
  }
  sumarTotalPorFecha(fecha: string) {
    return this.http.get<{fecha: string, total: number}>(`${this.url}/total`, {
      params: { fecha }
    });
  }
}
