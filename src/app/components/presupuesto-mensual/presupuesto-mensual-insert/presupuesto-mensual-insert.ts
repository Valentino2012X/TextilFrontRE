// src/app/components/presupuesto-mensual/presupuesto-mensual-insert/presupuesto-mensual-insert.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';

import { Router, ActivatedRoute } from '@angular/router';

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
      montoLimitePresupuestoMensual: [0, [Validators.required, Validators.min(0.01)]],
      fechaPresupuestoMensual: [{ value: new Date(), disabled: true }],
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
        const hoyLocal = new Date();
        this.pmS.listId(this.id).subscribe((data) => {
          let idUsuario: number | null = null;
          if (data.usuario && (data.usuario as any).idUsuario) {
            idUsuario = (data.usuario as any).idUsuario;
          } else if ((data as any).idUsuario) {
            // por si tu DTO usa idUsuario plano
            idUsuario = (data as any).idUsuario;
          }
          let fechaLocal: Date | null = null;
          if (data.fechaPresupuestoMensual) {
            const iso = data.fechaPresupuestoMensual.toString();
            const yyyyMmDd = iso.substring(0, 10);
            const parts = yyyyMmDd.split('-');
            if (parts.length === 3) {
              const y = Number(parts[0]);
              const m = Number(parts[1]);
              const d = Number(parts[2]);
              fechaLocal = new Date(y, m - 1, d);
            } else {
              const dt = new Date(iso);
              fechaLocal = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
            }
            this.form.patchValue({
              idPresupuestoMensual: data.idPresupuestoMensual,
              anioPresupuestoMensual: data.anioPresupuestoMensual,
              mesPresupuestoMensual: data.mesPresupuestoMensual,
              montoLimitePresupuestoMensual: data.montoLimitePresupuestoMensual,
              idUsuario: idUsuario,
            });
            this.form.get('fechaPresupuestoMensual')?.setValue(fechaLocal);
          }
        });
      }
    });
  }

  private formatDate(date: Date): string {
    const utc = new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
    const ra = this.form.getRawValue();
    const body: any = {
      idPresupuestoMensual: this.edicion ? raw.idPresupuestoMensual : 0,
      anioPresupuestoMensual: raw.anioPresupuestoMensual,
      mesPresupuestoMensual: raw.mesPresupuestoMensual,
      montoLimitePresupuestoMensual: raw.montoLimitePresupuestoMensual,
      fechaPresupuestoMensual: this.formatDate(ra.fechaPresupuestoMensual || new Date()),
      // 👇 Mandamos ambas variantes por si tu backend usa usuario o idUsuario.
      idUsuario: raw.idUsuario,
      usuario: {
        idUsuario: raw.idUsuario,
      },
    };

    const peticion = this.edicion ? this.pmS.update(body) : this.pmS.insert(body);

    peticion.subscribe({
      next: () => {
        this.pmS.list().subscribe((data) => this.pmS.setList(data));
        this.router.navigate(['presupuestomensual']);
      },
      error: (err) => {
        console.error('Error al guardar presupuesto mensual', err);
        // Si el backend manda un mensaje en el body, lo mostramos
        if (typeof err.error === 'string') {
          alert(err.error);
        } else if (err.error?.message) {
          alert(err.error.message);
        } else {
          alert('Ocurrió un error al guardar el presupuesto mensual');
        }
      },
    });
  }
  cancelar(): void {
    this.router.navigate(['presupuestomensual']);
  }
}
