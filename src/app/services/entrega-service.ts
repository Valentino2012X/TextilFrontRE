  // src/app/services/entrega-service.ts
  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Subject } from 'rxjs';
  import { Entrega } from '../models/Entrega';
  import { environment } from '../../environments/enviroment';

const base_url = environment.apiUrl;
  @Injectable({
    providedIn: 'root',
  })
  export class EntregaService {
    private url = `${base_url}/entregas`;
    private listaCambio = new Subject<Entrega[]>();

    constructor(private http: HttpClient) {}

    list() {
      return this.http.get<Entrega[]>(this.url);
    }

    insert(body: any) {
      return this.http.post(this.url, body);
    }

    listId(id: number) {
      return this.http.get<Entrega>(`${this.url}/${id}`);
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

    setList(listaNueva: Entrega[]) {
      this.listaCambio.next(listaNueva);
    }
  resumenPorRango(inicio: string, fin: string) {
    return this.http.get<{ totales: number; canceladas: number }>(`${this.url}/canceladas`, {
      params: { inicio, fin },
    });
  }
  }