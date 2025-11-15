import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/enviroment';
import { Favorito } from '../models/favorito';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class FavoritoService {
  private url = `${base_url}/favoritos`;
  private listaCambio = new Subject<Favorito[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Favorito[]>(this.url);
  }

  insert(body: any) {
    return this.http.post<Favorito>(this.url, body);
  }

  listId(id: number) {
    return this.http.get<Favorito>(`${this.url}/${id}`);
  }

  update(body: any) {
    return this.http.put<string>(this.url, body, { responseType: 'text' as 'json' });
  }

  delete(id: number) {
    return this.http.delete<string>(`${this.url}/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Favorito[]) {
    this.listaCambio.next(listaNueva);
  }
}
