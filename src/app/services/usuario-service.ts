// src/app/services/usuario-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { environment } from '../../environments/enviroment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = `${base_url}/usuario`; // backend: /usuario

  private listaCambio = new Subject<Usuario[]>();

  constructor(private http: HttpClient) {}

  // ===== CRUD BÁSICO =====
  list(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  insert(body: any): Observable<any> {
    return this.http.post(this.url, body);
  }

  listId(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  update(body: any): Observable<string> {
    return this.http.put(this.url, body, { responseType: 'text' });
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  // ===== LISTA REACTIVA =====
  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }

  // ===== SUBIR FOTO DE PERFIL =====
  uploadFoto(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file); // 👈 el backend espera "file"

    // NO seteamos Content-Type: el browser pone multipart/form-data solo
    return this.http.post(`${this.url}/${id}/foto`, formData, {
      responseType: 'text', // el backend devuelve la URL pública como String
    });
  }
}
