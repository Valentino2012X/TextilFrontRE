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

  list() {
    return this.http.get<Rol[]>(this.url);
  }

  insert(rol: Rol) {
    return this.http.post<string>(this.url, rol, {
      responseType: 'text' as 'json',
    });
  }

  listId(id: number) {
    return this.http.get<Rol>(`${this.url}/${id}`);
  }

  update(rol: Rol) {
    return this.http.put<string>(this.url, rol, {
      responseType: 'text' as 'json',
    });
  }

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
