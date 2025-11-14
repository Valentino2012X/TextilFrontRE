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
    this.form = this.fb.group({
      idNotificacion: [''],
      tipoNotificacion: ['', [Validators.required, Validators.maxLength(20)]],
      mensajeNotificacion: ['', [Validators.required, Validators.maxLength(255)]],
      fechaNotificacion: [new Date(), Validators.required],
      usuario: [null, Validators.required], // aquí guardamos el idUsuario
    });

    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
    });

    this.route.params.subscribe((params: Params) => {
      this.id = Number(params['id']);
      this.edicion = this.id > 0;

      if (this.edicion) {
        this.nS.listId(this.id).subscribe((data) => {
          this.form.patchValue({
            idNotificacion: data.idNotificacion,
            tipoNotificacion: data.tipoNotificacion,
            mensajeNotificacion: data.mensajeNotificacion,
            fechaNotificacion: data.fechaNotificacion,
            usuario: data.usuario.idUsuario,
          });
        });
      }
    });
  }

  // GETTERS para usar en el HTML sin escribir "?."
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

  aceptar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      idNotificacion: Number(this.form.value.idNotificacion),
      tipoNotificacion: this.form.value.tipoNotificacion,
      mensajeNotificacion: this.form.value.mensajeNotificacion,
      fechaNotificacion: this.form.value.fechaNotificacion,
      usuario: {
        idUsuario: Number(this.form.value.usuario),
      },
    };

    if (this.edicion) {
      this.nS.update(body).subscribe(() => {
        this.nS.list().subscribe((data) => this.nS.setList(data));
        this.router.navigate(['notificacion']);
      });
    } else {
      this.nS.insert(body).subscribe(() => {
        this.nS.list().subscribe((data) => this.nS.setList(data));
        this.router.navigate(['notificacion']);
      });
    }
  }
}
