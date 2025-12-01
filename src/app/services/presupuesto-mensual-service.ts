import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { environment } from '../../environments/enviroment';
import { PresupuestoMensual } from '../models/Presupuesto-mensual';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class PresupuestoMensualService {
  private url = `${base_url}/presupuestosmensuales`;
  private listaCambio = new Subject<PresupuestoMensual[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<PresupuestoMensual[]>(this.url);
  }

  insert(body: any) {
    return this.http.post(this.url, body);
  }

  listId(id: number) {
    return this.http.get<PresupuestoMensual>(`${this.url}/${id}`);
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

  setList(listaNueva: PresupuestoMensual[]) {
    this.listaCambio.next(listaNueva);
  }
}
