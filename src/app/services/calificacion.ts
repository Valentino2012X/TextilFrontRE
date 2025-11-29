import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/enviroment';
import { Calificacion } from '../models/calificacion';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class CalificacionService {
  private url = `${base_url}/calificaciones`;
  private listaCambio = new Subject<Calificacion[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Calificacion[]>(this.url);
  }

  insert(body: any) {
    return this.http.post(this.url, body);
  }

  listId(id: number) {
    return this.http.get<Calificacion>(`${this.url}/${id}`);
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

  setList(listaNueva: Calificacion[]) {
    this.listaCambio.next(listaNueva);
  }
}
