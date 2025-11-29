import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/Usuario';
import { Subject } from 'rxjs';
import { environment } from '../../environments/enviroment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = `${base_url}/usuario`; // backend: /usuario

  private listaCambio = new Subject<Usuario[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Usuario[]>(this.url);
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

  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }
}
