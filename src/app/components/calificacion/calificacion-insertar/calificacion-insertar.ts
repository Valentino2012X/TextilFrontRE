// src/app/components/calificacion/calificacion-insert/calificacion-insert.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';

import { CalificacionService } from '../../../services/calificacion';
import { PedidoService } from '../../../services/pedido-service';
import { UsuarioService } from '../../../services/usuario-service';

import { Calificacion } from '../../../models/calificacion';
import { Pedido } from '../../../models/Pedido';
import { Usuario } from '../../../models/Usuario';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-calificacion-insertar',
  templateUrl: './calificacion-insertar.html',
  styleUrl: './calificacion-insertar.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class CalificacionInsertarComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  listaPedidos: Pedido[] = [];
  listaUsuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private cS: CalificacionService,
    private pS: PedidoService,
    private uS: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const hoy = new Date();

    this.form = this.fb.group({
      idCalificacion: [0],
      estrellas: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['', [Validators.required, Validators.maxLength(100)]],
      fechaCalificacion: [hoy, Validators.required],
      idPedido: [null, Validators.required],
      idCalificador: [null, Validators.required],
      idCalificado: [null, Validators.required],
    });

    this.pS.list().subscribe((data) => (this.listaPedidos = data));
    this.uS.list().subscribe((data) => (this.listaUsuarios = data));

    this.route.params.subscribe((params: Params) => {
      this.id = Number(params['id']);
      this.edicion = this.id > 0;

      if (this.edicion) {
        this.cS.listId(this.id).subscribe((data: Calificacion) => {
          const fecha = data.fechaCalificacion
            ? new Date(data.fechaCalificacion as any)
            : hoy;

          this.form.patchValue({
            idCalificacion: data.idCalificacion,
            estrellas: data.estrellas,
            comentario: data.comentario,
            fechaCalificacion: fecha,
            idPedido: data.pedido?.idPedido ?? null,
            idCalificador: data.calificador?.idUsuario ?? null,
            idCalificado: data.calificado?.idUsuario ?? null,
          });
        });
      }
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return d.toISOString().split('T')[0];
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  aceptar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const idForm = Number(raw.idCalificacion) || 0;

    const body: any = {
      idCalificacion: idForm,
      estrellas: raw.estrellas,
      comentario: raw.comentario,
      fechaCalificacion: this.formatDate(raw.fechaCalificacion),
      pedido: {
        idPedido: raw.idPedido,
      },
      calificador: {
        idUsuario: raw.idCalificador,
      },
      calificado: {
        idUsuario: raw.idCalificado,
      },
    };

    const peticion: Observable<any> =
      idForm > 0 ? this.cS.update(body) : this.cS.insert(body);

    peticion.subscribe({
      next: () => {
        this.cS.list().subscribe((data: Calificacion[]) => this.cS.setList(data));
        this.router.navigate(['calificacion']);
      },
      error: (err: any) => {
        console.error('Error al guardar calificación', err);
        alert(err.error || 'Ocurrió un error al guardar la calificación');
      },
    });
  }
}
