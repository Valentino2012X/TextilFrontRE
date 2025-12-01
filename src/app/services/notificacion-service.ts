// src/app/services/notificacion-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/enviroment';
import { Notificacion } from '../models/Notificacion';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private url = `${base_url}/notificaciones`;
  private listaCambio = new Subject<Notificacion[]>();

  constructor(private http: HttpClient) {}

  // LISTAR
  list(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.url);
  }

  // INSERTAR -> backend devuelve String
  insert(body: any): Observable<string> {
    return this.http.post<string>(this.url, body, {
      responseType: 'text' as 'json',
    });
  }

  // LISTAR POR ID
  listId(id: number): Observable<Notificacion> {
    return this.http.get<Notificacion>(`${this.url}/${id}`);
  }

  // ACTUALIZAR -> backend devuelve String
  update(body: any): Observable<string> {
    return this.http.put<string>(this.url, body, {
      responseType: 'text' as 'json',
    });
  }

  // ELIMINAR -> backend devuelve String
  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  // SUBJECT PARA REFRESCAR LA TABLA
  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Notificacion[]) {
    this.listaCambio.next(listaNueva);
  }
}
