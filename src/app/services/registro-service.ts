import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroment';

export interface UsuarioDTOInsert {
  nombreUsuario: string;
  emailUsuario: string;
  username: string;
  password: string;
  telefonoUsuario: string;
  direccionUsuario: string;
  fechaRegistroUsuario: string; // LocalDate => "YYYY-MM-DD"
  enabled: boolean;
  idRol: number; // FK
}

const base_url = environment.base;

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private baseUrl = `${base_url}/usuario`; // backend: POST /usuario

  constructor(private http: HttpClient) {}

  registrar(payload: UsuarioDTOInsert): Observable<any> {
    // observe + text para evitar problemas si el backend responde vacío
    return this.http.post(this.baseUrl, payload, {
      observe: 'response',
      responseType: 'text',
    });
  }
}
