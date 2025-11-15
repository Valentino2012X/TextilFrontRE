// src/app/components/notificacion/notificacion-insert/notificacion-insert.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

import { NotificacionService } from '../../../services/notificacion-service';
import { UsuarioService } from '../../../services/usuario-service';
import { Usuario } from '../../../models/Usuario';

@Component({
  standalone: true,
  selector: 'app-notificacion-insertar',
  templateUrl: './notificacion-insert.html',
  styleUrl: './notificacion-insert.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class NotificacionInsertarComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  listaUsuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private nS: NotificacionService,
    private uS: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const hoy = new Date();

    this.form = this.fb.group({
      idNotificacion: [''],
      tipoNotificacion: ['', [Validators.required, Validators.maxLength(20)]],
      mensajeNotificacion: ['', [Validators.required, Validators.maxLength(255)]],
      fechaNotificacion: [hoy, Validators.required],
      // aquí guardamos SOLO el idUsuario
      usuario: [null, Validators.required],
    });

    // Cargar usuarios para el combo
    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
    });

    // Modo edición
    this.route.params.subscribe((params: Params) => {
      this.id = Number(params['id']);
      this.edicion = this.id > 0;

      if (this.edicion) {
        this.nS.listId(this.id).subscribe((data) => {
          this.form.patchValue({
            idNotificacion: data.idNotificacion,
            tipoNotificacion: data.tipoNotificacion,
            mensajeNotificacion: data.mensajeNotificacion,
            // El backend manda LocalDate -> string "yyyy-MM-dd"
            fechaNotificacion: data.fechaNotificacion
              ? new Date(data.fechaNotificacion as any)
              : hoy,
            usuario: data.usuario?.idUsuario ?? null,
          });
        });
      }
    });
  }

  // Helpers para el HTML
  get tipoNotificacionField(): FormControl {
    return this.form.get('tipoNotificacion') as FormControl;
  }

  get mensajeNotificacionField(): FormControl {
    return this.form.get('mensajeNotificacion') as FormControl;
  }

  get fechaNotificacionField(): FormControl {
    return this.form.get('fechaNotificacion') as FormControl;
  }

  get usuarioField(): FormControl {
    return this.form.get('usuario') as FormControl;
  }

  private formatDate(date: Date): string {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return d.toISOString().split('T')[0]; // yyyy-MM-dd
  }

  aceptar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const fecha: Date = raw.fechaNotificacion;

    const body = {
      idNotificacion: raw.idNotificacion ? Number(raw.idNotificacion) : 0,
      tipoNotificacion: raw.tipoNotificacion,
      mensajeNotificacion: raw.mensajeNotificacion,
      // Mandamos string compatible con LocalDate
      fechaNotificacion: this.formatDate(fecha),
      usuario: {
        idUsuario: Number(raw.usuario),
      },
    };

    if (this.edicion) {
      this.nS.update(body).subscribe({
        next: () => {
          this.nS.list().subscribe((data) => this.nS.setList(data));
          this.router.navigate(['notificacion']); // ajusta si tu ruta es diferente
        },
        error: (err) => {
          console.error('Error al actualizar notificación', err);
          alert('Ocurrió un error al actualizar la notificación');
        },
      });
    } else {
      this.nS.insert(body).subscribe({
        next: () => {
          this.nS.list().subscribe((data) => this.nS.setList(data));
          this.router.navigate(['notificacion']);
        },
        error: (err) => {
          console.error('Error al registrar notificación', err);
          alert('Ocurrió un error al registrar la notificación');
        },
      });
    }
  }
}
