import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/enviroment';
import { Tarjeta } from '../models/tarjeta';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class TarjetaService {
  private url = `${base_url}/tarjetas`;
  private listaCambio = new Subject<Tarjeta[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Tarjeta[]>(this.url);
  }

  insert(body: any) {
    return this.http.post(this.url, body);
  }

  listId(id: number) {
    return this.http.get<Tarjeta>(`${this.url}/${id}`);
  }

  // SOLO actualiza el alias (como tu backend)
  update(id: number, body: any) {
    return this.http.put(`${this.url}/${id}`, body);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Tarjeta[]) {
    this.listaCambio.next(listaNueva);
  }

  getCantidadPorMarca() {
   return this.http.get<any[]>(`${this.url}/cantidad/marcas`);
  }
  
  buscarPorVencimiento(inicio: string, fin: string) {
  return this.http.get<any[]>(`${this.url}/vencimiento`, {
    params: { inicio, fin }
  });
}

}
