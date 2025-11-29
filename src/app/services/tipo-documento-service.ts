import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/enviroment';
import { Observable, Subject } from 'rxjs';
import { TipoDocumento } from '../models/Tipo-documento';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoService {
  private url = `${base_url}/tiposdocumentos`;
  private listaCambio = new Subject<TipoDocumento[]>();

  constructor(private http: HttpClient) {}

  // GET /tiposdocumentos/listar
  list(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(`${this.url}/listar`);
  }

  // POST /tiposdocumentos
  insert(td: TipoDocumento): Observable<any> {
    return this.http.post(this.url, td);
  }

  // GET /tiposdocumentos/{id}
  listId(id: number): Observable<TipoDocumento> {
    return this.http.get<TipoDocumento>(`${this.url}/${id}`);
  }

  // PUT /tiposdocumentos
  update(td: TipoDocumento): Observable<string> {
    return this.http.put<string>(this.url, td, {
      responseType: 'text' as 'json',
    });
  }

  // DELETE /tiposdocumentos/{id}
  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  // GET /tiposdocumentos/bnombres?n=...
  buscarNombre(nombre: string): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(`${this.url}/bnombres?n=${nombre}`);
  }

  setList(listaNueva: TipoDocumento[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}
