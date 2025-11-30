import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';

import { CalificacionService } from '../../../services/calificacion';
import { UsuarioService } from '../../../services/usuario-service';
import { PedidoService } from '../../../services/pedido-service';

import { Calificacion } from '../../../models/calificacion';
import { Usuario } from '../../../models/Usuario';
import { Pedido } from '../../../models/Pedido';

@Component({
  selector: 'app-calificacion-insertar',
  standalone: true,
  templateUrl: './calificacion-insertar.html',
  styleUrl: './calificacion-insertar.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatOptionModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class CalificacionInsertarComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;

  listaUsuarios: Usuario[] = [];
  listaPedidos: Pedido[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cS: CalificacionService,
    private uS: UsuarioService,
    private pS: PedidoService
  ) {}

  ngOnInit(): void {
    this.uS.list().subscribe((data) => (this.listaUsuarios = data));
    this.pS.list().subscribe((data) => (this.listaPedidos = data));

    this.form = this.fb.group(
      {
        idCalificacion: [''],
        estrellas: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
        comentario: ['', Validators.required],
        fechaCalificacion: [new Date(), Validators.required],

        idPedido: [null, Validators.required],
        idCalificador: [null, Validators.required],
        idCalificado: [null, Validators.required],
      },
      { validators: [this.calificadorDistintoCalificadoValidator()] }
    );

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;
      if (this.edicion) {
        this.initForm();
      }
    });
  }

  // ------------ helpers fecha ------------
  private toIsoDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private parseIsoToDate(iso: string | null | undefined): Date | null {
    if (!iso) return null;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

  // ------------ validator calificador ≠ calificado ------------
  calificadorDistintoCalificadoValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const calificador = group.get('idCalificador')?.value;
      const calificado = group.get('idCalificado')?.value;

      if (!calificador || !calificado) return null;
      return calificador === calificado
        ? { mismoUsuarioCalificacion: true }
        : null;
    };
  }

  // ------------ cargar datos en edición ------------
  initForm(): void {
    this.cS.listId(this.id).subscribe((data: Calificacion) => {
      this.form.patchValue({
        idCalificacion: data.idCalificacion,
        estrellas: data.estrellas,
        comentario: data.comentario,
        fechaCalificacion: this.parseIsoToDate(
          data.fechaCalificacion as string
        ),
        idPedido: data.pedido?.idPedido,
        idCalificador: data.calificador?.idUsuario,
        idCalificado: data.calificado?.idUsuario,
      });
    });
  }

  // ------------ guardar ------------
  aceptar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const cal = new Calificacion();
    cal.idCalificacion = raw.idCalificacion || 0;
    cal.estrellas = Number(raw.estrellas);
    cal.comentario = raw.comentario;
    cal.fechaCalificacion = this.toIsoDate(raw.fechaCalificacion);

    cal.pedido = { idPedido: raw.idPedido } as Pedido;
    cal.calificador = { idUsuario: raw.idCalificador } as Usuario;
    cal.calificado = { idUsuario: raw.idCalificado } as Usuario;

    if (this.edicion) {
      this.cS.update(cal).subscribe(() => {
        this.cS.list().subscribe((data) => this.cS.setList(data));
        this.router.navigate(['/calificacion']);
      });
    } else {
      this.cS.insert(cal).subscribe(() => {
        this.cS.list().subscribe((data) => this.cS.setList(data));
        this.router.navigate(['/calificacion']);
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/calificacion']);
  }

  get f() {
    return this.form.controls;
  }
}