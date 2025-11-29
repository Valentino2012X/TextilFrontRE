import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistroService, UsuarioDTOInsert } from '../../services/registro-service';

type RolOpcion = { idRol: number; nombreRol: 'ESTUDIANTE' | 'VENDEDOR' };

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private registroService = inject(RegistroService);

  // ✅ Solo se permite registrarse como ESTUDIANTE o VENDEDOR
  roles: RolOpcion[] = [
    { idRol: 2, nombreRol: 'ESTUDIANTE' },
    { idRol: 3, nombreRol: 'VENDEDOR' },
  ];

  cargando = false;
  successMsg = '';
  errorMsg = '';

  form = this.fb.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    emailUsuario: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(200)]],
    telefonoUsuario: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    direccionUsuario: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]],
    idRol: [null as number | null, [Validators.required]],
  });

  private todayLocalDate(): string {
    // "YYYY-MM-DD" para LocalDate del backend
    return new Date().toISOString().slice(0, 10);
  }

  cancelar(): void {
    this.router.navigate(['/login']);
  }

  registrar(): void {
    this.successMsg = '';
    this.errorMsg = '';

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errorMsg = 'Completa correctamente el formulario.';
      return;
    }

    const idRol = this.form.value.idRol!;
    const allowed = this.roles.some((r) => r.idRol === idRol);
    if (!allowed) {
      this.errorMsg = 'Solo puedes registrarte como ESTUDIANTE o VENDEDOR.';
      return;
    }

    const payload: UsuarioDTOInsert = {
      nombreUsuario: this.form.value.nombreUsuario!.trim(),
      emailUsuario: this.form.value.emailUsuario!.trim(),
      username: this.form.value.username!.trim(),
      password: this.form.value.password!.trim(),
      telefonoUsuario: this.form.value.telefonoUsuario!.trim(),
      direccionUsuario: this.form.value.direccionUsuario!.trim(),
      fechaRegistroUsuario: this.todayLocalDate(),
      enabled: true,
      idRol,
    };

    this.cargando = true;

    this.registroService.registrar(payload).subscribe({
      next: () => {
        this.cargando = false;
        this.successMsg = '✅ Registro exitoso. Ahora inicia sesión.';

        // NO loguea automáticamente. Te manda a login.
        setTimeout(() => this.router.navigate(['/login']), 700);
      },
      error: (err) => {
        this.cargando = false;

        // backend podría mandar string (ej: conflicto/duplicado)
        const msg =
          (typeof err?.error === 'string' && err.error) ||
          err?.error?.message ||
          'No se pudo registrar. Revisa que el email no esté repetido y que el backend esté corriendo.';
        this.errorMsg = msg;
      },
    });
  }

  // helpers de template
  get f() {
    return this.form.controls;
  }
}
