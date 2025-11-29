import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Comprobante } from '../models/Comprobante';
import { environment } from '../../environments/enviroment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ComprobanteService {
  private url = `${base_url}/comprobantes`;

  private listaCambio = new Subject<Comprobante[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Comprobante[]>(this.url);
  }

  listId(id: number) {
    return this.http.get<Comprobante>(`${this.url}/${id}`);
  }

  // src/app/services/comprobante-service.ts
  insert(body: any) {
    return this.http.post(this.url, body, {
      responseType: 'text' as 'json', // <-- no intenta parsear JSON
    });
  }

  update(body: any) {
    return this.http.put(this.url, body, {
      responseType: 'text' as 'json',
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  // Opcionales (por si luego usas los endpoints extra)
  listByPedido(idPedido: number) {
    return this.http.get<Comprobante[]>(`${this.url}/pedido/${idPedido}`);
  }

  countByPedido(idPedido: number) {
    return this.http.get(`${this.url}/pedido/${idPedido}/cantidad`);
  }

  searchByRangoFechas(inicio: string, fin: string) {
    return this.http.get<Comprobante[]>(`${this.url}/rango-fechas`, {
      params: { inicio, fin },
    });
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Comprobante[]) {
    this.listaCambio.next(listaNueva);
  }
  
  sumarIgvPorFecha(fecha: string) {
    return this.http.get<{fecha: string, totalIgv: number}>(`${this.url}/igvtotal`, {
      params: { fecha }
    });
  }
}
