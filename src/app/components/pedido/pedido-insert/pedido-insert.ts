import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';

import { PedidoService } from '../../../services/pedido-service';
import { UsuarioService } from '../../../services/usuario-service';
import { MetodoPagoService } from '../../../services/metodo-pago';

import { Usuario } from '../../../models/Usuario';
import { MetodoPago } from '../../../models/Metodo-pago';
import { Pedido } from '../../../models/Pedido';

@Component({
  standalone: true,
  selector: 'app-pedido-insertar',
  templateUrl: './pedido-insert.html',
  styleUrl: './pedido-insert.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class PedidoInsertarComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  // >>> NUEVO: bandera para saber si ya intentaste guardar
  submitted: boolean = false;

  listaUsuarios: Usuario[] = [];
  listaMetodos: MetodoPago[] = [];

  constructor(
    private fb: FormBuilder,
    private pS: PedidoService,
    private uS: UsuarioService,
    private mS: MetodoPagoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const hoy = new Date(); // fecha actual

    this.form = this.fb.group({
      idPedido: [''],
      estadoPedido: ['', Validators.required],
      fechaCreacionPedido: [hoy, Validators.required],
      fechaPagoPedido: [null, Validators.required],
      totalPedido: [0, [Validators.required, Validators.min(0)]],
      vendedor: ['', Validators.required],
      comprador: ['', Validators.required],
      metodoPago: ['', Validators.required],
    });

    // combos
    this.uS.list().subscribe((data) => (this.listaUsuarios = data));
    this.mS.list().subscribe((data) => (this.listaMetodos = data));

    // edición
    this.route.params.subscribe((params) => {
      this.id = Number(params['id']);
      this.edicion = !!this.id;

      if (this.edicion) {
        this.pS.listId(this.id).subscribe((data: Pedido) => {
          const fc = new Date(data.fechaCreacionPedido);
          const fp = new Date(data.fechaPagoPedido);

          this.form.patchValue({
            idPedido: data.idPedido,
            estadoPedido: data.estadoPedido,
            fechaCreacionPedido: fc,
            fechaPagoPedido: fp,
            totalPedido: data.totalPedido,
            vendedor: data.vendedor.idUsuario,
            comprador: data.comprador.idUsuario,
            metodoPago: data.metodoPago.idMetodoPago,
          });
        });
      }
    });
  }

  // >>> NUEVO: usado por los <mat-error> en el HTML
  campoInvalido(nombre: string): boolean {
    const control = this.form.get(nombre);
    return (
      control !== null &&
      control.invalid &&
      (control.touched || this.submitted)
    );
  }

  private formatDate(d: any): string {
    const date = d instanceof Date ? d : new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  aceptar() {
    // >>> NUEVO: marcamos que ya intentaste guardar
    this.submitted = true;

    // si hay errores, solo mostramos mat-error, no hacemos alert ni post
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const body = {
      idPedido: this.edicion ? Number(raw.idPedido) : 0,
      estadoPedido: raw.estadoPedido,
      fechaCreacionPedido: this.formatDate(raw.fechaCreacionPedido),
      fechaPagoPedido: this.formatDate(raw.fechaPagoPedido),
      totalPedido: raw.totalPedido,
      vendedor: { idUsuario: raw.vendedor },
      comprador: { idUsuario: raw.comprador },
      metodoPago: { idMetodoPago: raw.metodoPago },
    };

    const obs = this.edicion ? this.pS.update(body) : this.pS.insert(body);

    obs.subscribe(() => {
      this.pS.list().subscribe((data) => this.pS.setList(data));
      this.router.navigate(['pedido']);
    });
  }
}
