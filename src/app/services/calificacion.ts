// src/app/services/calificacion-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/enviroment'; // 👈 corregido
import { Calificacion } from '../models/calificacion';

// Usamos apiUrl, que en prod apunta a https://g5-textilconnect.onrender.com
const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class CalificacionService {
  // Ajusta el path según tu backend: /calificaciones o /calificacion
  private url = `${base_url}/calificaciones`;

  private listaCambio = new Subject<Calificacion[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Calificacion[]>(this.url);
  }

  insert(body: Calificacion) {
    return this.http.post(this.url, body);
  }

  listId(id: number) {
    return this.http.get<Calificacion>(`${this.url}/${id}`);
  }

  update(body: Calificacion) {
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
