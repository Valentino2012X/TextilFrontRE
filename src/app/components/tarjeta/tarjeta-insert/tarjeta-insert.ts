import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

import { TarjetaService } from '../../../services/tarjeta';
import { UsuarioService } from '../../../services/usuario-service';
import { Tarjeta } from '../../../models/tarjeta';
import { Usuario } from '../../../models/Usuario';

@Component({
  standalone: true,
  selector: 'app-tarjeta-insertar',
  templateUrl: './tarjeta-insert.html',
  styleUrl: './tarjeta-insert.css',
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
export class TarjetaInsertarComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  listaUsuarios: Usuario[] = [];

  tiposTarjeta = ['CRÉDITO', 'DÉBITO'];
  marcas = ['VISA', 'MASTERCARD', 'AMEX', 'OTRA'];
  minVencimiento!: Date;

  constructor(
    private fb: FormBuilder,
    private tS: TarjetaService,
    private uS: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const hoy = new Date();
    this.minVencimiento = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
    this.form = this.fb.group({
      idTarjeta: [0],
      aliasTarjeta: ['', [Validators.required, Validators.maxLength(50)]],
      tipoTarjeta: ['', Validators.required],
      ultimos4Tarjeta: ['', [Validators.required,Validators.minLength(4), Validators.pattern(/^\d+$/)]],
      marcaTarjeta: ['', Validators.required],
      tokenReferenciaTarjeta: ['', [Validators.required, Validators.maxLength(100)]],
      vencimientoTarjeta: [hoy, Validators.required],
      activaTarjeta: [true, Validators.required],
      fechaRegistroTarjeta: [{ value: new Date(), disabled: true }],
      usuario: [null, Validators.required], // idUsuario
    });

    // cargar usuarios
    this.uS.list().subscribe((data) => (this.listaUsuarios = data));

    // detectar si es edición
    this.route.params.subscribe((params: Params) => {
      this.id = Number(params['id']);
      this.edicion = this.id > 0;
      
      if (this.edicion) {
        this.tS.listId(this.id).subscribe((data: Tarjeta) => {
const venc = this.parseFechaLocal(data.vencimientoTarjeta) ?? hoy;
const fechaReg = this.parseFechaLocal(data.fechaRegistroTarjeta) ?? hoy;

          this.form.patchValue({
            idTarjeta: data.idTarjeta,
            aliasTarjeta: data.aliasTarjeta,
            tipoTarjeta: data.tipoTarjeta,
            ultimos4Tarjeta: data.ultimos4Tarjeta,
            marcaTarjeta: data.marcaTarjeta,
            tokenReferenciaTarjeta: data.tokenReferenciaTarjeta,
            vencimientoTarjeta: venc,
            activaTarjeta: data.activaTarjeta,
            fechaRegistroTarjeta: fechaReg,
            usuario: data.usuario?.idUsuario ?? null,
          });
        });
      }
    });
  }
private parseFechaLocal(fechaIso: any): Date | null {
  if (!fechaIso) return null;

  const iso = fechaIso.toString();
  const yyyyMmDd = iso.substring(0, 10); 

  const parts = yyyyMmDd.split('-');
  if (parts.length === 3) {
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    return new Date(y, m - 1, d); 
  }

  const dt = new Date(iso);
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

private formatDate(date: any): string {
  const d = new Date(date);
  const corrected = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  return corrected.toISOString().split('T')[0];
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

    const raw = this.form.getRawValue();

    const body = {
      idTarjeta: raw.idTarjeta,
      aliasTarjeta: raw.aliasTarjeta,
      tipoTarjeta: raw.tipoTarjeta,
      ultimos4Tarjeta: raw.ultimos4Tarjeta,
      marcaTarjeta: raw.marcaTarjeta,
      tokenReferenciaTarjeta: raw.tokenReferenciaTarjeta,
      vencimientoTarjeta: this.formatDate(raw.vencimientoTarjeta),
      activaTarjeta: raw.activaTarjeta,
      fechaRegistroTarjeta: this.formatDate(raw.fechaRegistroTarjeta),
      usuario: {
        idUsuario: raw.usuario,
      },
    };

    if (this.edicion) {
      // UPDATE
      this.tS.update(this.id, body).subscribe({
        next: () => {
          this.tS.list().subscribe((data) => this.tS.setList(data));
          this.router.navigate(['tarjeta']);
        },
        error: (err) => {
          console.error('Error al actualizar tarjeta', err);
          alert(err.error || 'Ocurrió un error al actualizar la tarjeta');
        },
      });
      return;
    }

    // INSERT
    this.tS.insert(body).subscribe({
      next: () => {
        this.tS.list().subscribe((data) => this.tS.setList(data));
        this.router.navigate(['tarjeta']);
      },
      error: (err) => {
        console.error('Error al registrar tarjeta', err);
        alert(err.error || 'Ocurrió un error al registrar la tarjeta');
      },
    });
  }
}
