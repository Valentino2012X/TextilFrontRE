// src/app/components/perfil/perfil.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/Usuario';

@Component({
  standalone: true,
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class PerfilComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario?: Usuario;
  loading = true;

  // estados para upload
  subiendoFoto = false;
  errorFoto = '';
  successFoto = '';

  ngOnInit(): void {
    const usernameActual = this.authService.getUsernameFromToken();

    if (!usernameActual) {
      this.loading = false;
      return;
    }

    this.usuarioService.list().subscribe({
      next: (lista: Usuario[]) => {
        this.usuario = lista.find((u) => u.username === usernameActual);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  irAEditar(): void {
    if (!this.usuario) return;
    this.router.navigate(['/usuarios/edits', this.usuario.idUsuario]);
  }

  // 👇 NUEVO: handler de input file
  onFileSelected(event: Event): void {
    this.errorFoto = '';
    this.successFoto = '';

    if (!this.usuario) return;

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.errorFoto = 'No se seleccionó ningún archivo.';
      return;
    }

    const file = input.files[0]; // <== AQUÍ solo obtenemos el File

    this.subiendoFoto = true;

    this.usuarioService.uploadFoto(this.usuario.idUsuario, file).subscribe({
      next: (urlPublica: string) => {
        this.subiendoFoto = false;
        this.successFoto = 'Foto actualizada correctamente.';
        // refrescamos la foto en pantalla
        this.usuario!.fotoUrl = urlPublica;
      },
      error: (err) => {
        this.subiendoFoto = false;
        const msg =
          (typeof err?.error === 'string' && err.error) ||
          err?.error?.message ||
          'Error al subir la foto.';
        this.errorFoto = msg;
      },
    });
  }
}
