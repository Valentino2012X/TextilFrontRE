import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { PedidoItem } from '../models/Pedido-item';
import { environment } from '../../environments/enviroment';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class PedidoItemService {
  private url = `${base_url}/pedidositems`;

  private listaCambio = new Subject<PedidoItem[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<PedidoItem[]>(this.url);
  }

  // pedido-item-service.ts
  insert(body: any) {
    return this.http.post(this.url, body, {
      responseType: 'text' as 'json', // 👈 IMPORTANTE
    });
  }

  listId(id: number) {
    return this.http.get<PedidoItem>(`${this.url}/${id}`);
  }

  update(body: any) {
    return this.http.put(this.url, body, {
      responseType: 'text' as 'json', // también texto
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      responseType: 'text' as 'json', // y aquí igual
    });
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: PedidoItem[]) {
    this.listaCambio.next(listaNueva);
  }
}
