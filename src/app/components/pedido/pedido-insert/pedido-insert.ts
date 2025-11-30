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

import { PedidoService } from '../../../services/pedido-service';
import { UsuarioService } from '../../../services/usuario-service';
import { MetodoPagoService } from '../../../services/metodo-pago';

import { Pedido } from '../../../models/Pedido';
import { Usuario } from '../../../models/Usuario';
import { MetodoPago } from '../../../models/Metodo-pago';

@Component({
  selector: 'app-pedido-insert',
  standalone: true,
  templateUrl: './pedido-insert.html',
  styleUrl: './pedido-insert.css',
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
export class PedidoInsertarComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;

  listaUsuarios: Usuario[] = [];
  listaMetodosPago: MetodoPago[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pS: PedidoService,
    private uS: UsuarioService,
    private mS: MetodoPagoService
  ) {}

  ngOnInit(): void {
    // combos
    this.uS.list().subscribe((data) => (this.listaUsuarios = data));
    this.mS.list().subscribe((data) => (this.listaMetodosPago = data));

    // form
    this.form = this.fb.group(
      {
        idPedido: [''],
        estadoPedido: ['', Validators.required],
        totalPedido: [0, [Validators.required, Validators.min(0)]],
        fechaCreacionPedido: [new Date(), Validators.required],
        fechaPagoPedido: [null],

        idVendedor: [null, Validators.required],
        idComprador: [null, Validators.required],
        idMetodoPago: [null, Validators.required],
      },
      { validators: [this.vendedorCompradorDistintosValidator()] }
    );

    // edición
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;
      if (this.edicion) {
        this.initForm();
      }
    });
  }

  // ------------ Helpers de fecha ------------
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

  // ------------ Validator: vendedor ≠ comprador ------------
  vendedorCompradorDistintosValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const vendedor = group.get('idVendedor')?.value;
      const comprador = group.get('idComprador')?.value;

      if (!vendedor || !comprador) return null;
      return vendedor === comprador ? { mismoUsuarioPedido: true } : null;
    };
  }

  // ------------ Cargar datos en edición ------------
  initForm(): void {
    this.pS.listId(this.id).subscribe((data: Pedido) => {
      this.form.patchValue({
        idPedido: data.idPedido,
        estadoPedido: data.estadoPedido,
        totalPedido: data.totalPedido,
        fechaCreacionPedido: this.parseIsoToDate(data.fechaCreacionPedido),
        fechaPagoPedido: this.parseIsoToDate(data.fechaPagoPedido),
        idVendedor: data.vendedor?.idUsuario,
        idComprador: data.comprador?.idUsuario,
        idMetodoPago: data.metodoPago?.idMetodoPago,
      });
    });
  }

  // ------------ Guardar ------------
  aceptar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const pedido = new Pedido();
    pedido.idPedido = raw.idPedido || 0;
    pedido.estadoPedido = raw.estadoPedido;
    pedido.totalPedido = Number(raw.totalPedido);
    pedido.fechaCreacionPedido = this.toIsoDate(raw.fechaCreacionPedido);
    pedido.fechaPagoPedido = raw.fechaPagoPedido
      ? this.toIsoDate(raw.fechaPagoPedido)
      : '';

    pedido.vendedor = { idUsuario: raw.idVendedor } as Usuario;
    pedido.comprador = { idUsuario: raw.idComprador } as Usuario;
    pedido.metodoPago = {
      idMetodoPago: raw.idMetodoPago,
    } as MetodoPago;

    if (this.edicion) {
      this.pS.update(pedido).subscribe(() => {
        this.pS.list().subscribe((data) => this.pS.setList(data));
        this.router.navigate(['/pedido']);
      });
    } else {
      this.pS.insert(pedido).subscribe(() => {
        this.pS.list().subscribe((data) => this.pS.setList(data));
        this.router.navigate(['/pedido']);
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/pedido']);
  }

  get f() {
    return this.form.controls;
  }
}