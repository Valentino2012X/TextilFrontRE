import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/enviroment';
import { Observable, Subject } from 'rxjs';
import { MetodoPago } from '../models/Metodo-pago';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class MetodoPagoService {
  private url = `${base_url}/metodospagos`;
  private listaCambio = new Subject<MetodoPago[]>();

  constructor(private http: HttpClient) {}

  // GET /metodospagos
  list(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(this.url);
  }

  // POST /metodospagos
  insert(metodo: MetodoPago): Observable<any> {
    return this.http.post(this.url, metodo);
  }

  // GET /metodospagos/{id}
  listId(id: number): Observable<MetodoPago> {
    return this.http.get<MetodoPago>(`${this.url}/${id}`);
  }

  // PUT /metodospagos  (el backend devuelve un String)
  update(metodo: MetodoPago): Observable<string> {
    return this.http.put<string>(this.url, metodo, {
      responseType: 'text' as 'json',
    });
  }

  // DELETE /metodospagos/{id}  (el backend devuelve un String)
  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  // GET /metodospagos/bnombres?n=...
  buscarNombre(nombre: string): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(`${this.url}/bnombres?n=${nombre}`);
  }

  setList(listaNueva: MetodoPago[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}