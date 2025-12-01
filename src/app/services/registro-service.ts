// src/app/services/registro.service.ts (o como lo tengas)

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroment'; // 👈 IMPORTANTE

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

@Injectable({ providedIn: 'root' })
export class RegistroService {
  // 👇 En dev:  http://localhost:8080/usuario
  //    En prod: https://g5-textilconnect.onrender.com/usuario
  private baseUrl = `${environment.apiUrl}/usuario`; // 👈 AJUSTA el path si tu backend usa /usuarios o /auth/registro

  constructor(private http: HttpClient) {}

  registrar(payload: UsuarioDTOInsert): Observable<any> {
    return this.http.post(this.baseUrl, payload, {
      observe: 'response',
      responseType: 'text',
    });
  }
}
