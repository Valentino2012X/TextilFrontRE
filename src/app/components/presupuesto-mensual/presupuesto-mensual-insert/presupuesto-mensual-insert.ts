import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';

import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { PresupuestoMensualService } from '../../../services/presupuesto-mensual-service';
import { UsuarioService } from '../../../services/usuario-service';
import { Usuario } from '../../../models/Usuario';

@Component({
  standalone: true,
  selector: 'app-presupuesto-mensual-insertar',
  templateUrl: './presupuesto-mensual-insert.html',
  styleUrl: './presupuesto-mensual-insert.css',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatOptionModule,
  ],
})
export class PresupuestoMensualInsertarComponent implements OnInit {
  form!: FormGroup;
  id = 0;
  edicion = false;

  usuarios: Usuario[] = [];

  meses = [
    { valor: 1, label: 'Enero' },
    { valor: 2, label: 'Febrero' },
    { valor: 3, label: 'Marzo' },
    { valor: 4, label: 'Abril' },
    { valor: 5, label: 'Mayo' },
    { valor: 6, label: 'Junio' },
    { valor: 7, label: 'Julio' },
    { valor: 8, label: 'Agosto' },
    { valor: 9, label: 'Septiembre' },
    { valor: 10, label: 'Octubre' },
    { valor: 11, label: 'Noviembre' },
    { valor: 12, label: 'Diciembre' },
  ];

  constructor(
    private fb: FormBuilder,
    private pmS: PresupuestoMensualService,
    private uS: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = hoy.getMonth() + 1;

    this.form = this.fb.group({
      idPresupuestoMensual: [0],
      anioPresupuestoMensual: [
        year,
        [Validators.required, Validators.min(2000), Validators.max(2100)],
      ],
      mesPresupuestoMensual: [month, [Validators.required]],
      montoLimitePresupuestoMensual: [
        0,
        [Validators.required, Validators.min(0.01)],
      ],
      fechaPresupuestoMensual: [hoy, [Validators.required]],
      idUsuario: [null, [Validators.required]],
    });

    // cargar usuarios
    this.uS.list().subscribe((data) => {
      this.usuarios = data;
    });

    // revisar si es edición
    this.route.params.subscribe((params) => {
      const paramId = params['id'];
      if (paramId) {
        this.id = Number(paramId);
        this.edicion = true;
        this.pmS.listId(this.id).subscribe((data) => {
          let fecha = hoy;
          if (data.fechaPresupuestoMensual) {
            fecha = new Date(data.fechaPresupuestoMensual);
          }

          let idUsuario = null;
          if (data.usuario && data.usuario.idUsuario) {
            idUsuario = data.usuario.idUsuario;
          }

          this.form.patchValue({
            idPresupuestoMensual: data.idPresupuestoMensual,
            anioPresupuestoMensual: data.anioPresupuestoMensual,
            mesPresupuestoMensual: data.mesPresupuestoMensual,
            montoLimitePresupuestoMensual: data.montoLimitePresupuestoMensual,
            fechaPresupuestoMensual: fecha,
            idUsuario: idUsuario,
          });
        });
      }
    });
  }

  private formatDate(date: Date): string {
    const utc = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const iso = utc.toISOString();
    return iso.split('T')[0]; // yyyy-MM-dd
  }

  isInvalid(campo: string): boolean {
    const control = this.form.get(campo);
    if (!control) {
      return false;
    }
    return control.invalid && (control.dirty || control.touched);
  }

  aceptar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const body: any = {
      idPresupuestoMensual: raw.idPresupuestoMensual,
      anioPresupuestoMensual: raw.anioPresupuestoMensual,
      mesPresupuestoMensual: raw.mesPresupuestoMensual,
      montoLimitePresupuestoMensual: raw.montoLimitePresupuestoMensual,
      fechaPresupuestoMensual: this.formatDate(
        raw.fechaPresupuestoMensual as Date
      ),
      usuario: {
        idUsuario: raw.idUsuario,
      },
    };

    const peticion = this.edicion
      ? this.pmS.update(body)
      : this.pmS.insert(body);

    peticion.subscribe(() => {
      this.pmS.list().subscribe((data) => this.pmS.setList(data));
      this.router.navigate(['presupuestomensual']);
    });
  }
}
