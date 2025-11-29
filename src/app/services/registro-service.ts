import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private baseUrl = 'http://localhost:8080/usuario'; // ✅ tu backend real

  constructor(private http: HttpClient) {}

  registrar(payload: UsuarioDTOInsert): Observable<any> {
    // observe+text para evitar problemas si el backend responde vacío
    return this.http.post(this.baseUrl, payload, {
      observe: 'response',
      responseType: 'text',
    });
  }
}
