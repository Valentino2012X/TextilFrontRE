// src/app/components/comprobante/comprobante-insert/comprobante-insert.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { ComprobanteService } from '../../../services/comprobante-service';
import { PedidoService } from '../../../services/pedido-service';
import { TipoDocumentoService } from '../../../services/tipo-documento-service';

import { Comprobante } from '../../../models/Comprobante';
import { Pedido } from '../../../models/Pedido';
import { TipoDocumento } from '../../../models/Tipo-documento';

@Component({
  standalone: true,
  selector: 'app-comprobante-insertar',
  templateUrl: './comprobante-insert.html',
  styleUrl: './comprobante-insert.css',
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
export class ComprobanteInsertarComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  listaPedidos: Pedido[] = [];
  listaTiposDocumento: TipoDocumento[] = [];

  constructor(
    private fb: FormBuilder,
    private cS: ComprobanteService,
    private pS: PedidoService,
    private tdS: TipoDocumentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idComprobante: [''],
      numeroComprobante: ['', Validators.required],
      fechaComprobante: [null, Validators.required],
      razonSocialComprobante: ['', Validators.required],
      igvComprobante: [0, [Validators.required, Validators.min(0)]],
      totalComprobante: [0, [Validators.required, Validators.min(0)]],
      // aquí guardamos solo el ID
      pedido: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
    });

    // combos
    this.pS.list().subscribe((data) => (this.listaPedidos = data));
    this.tdS.list().subscribe((data) => (this.listaTiposDocumento = data));

    // modo edición
    this.route.params.subscribe((params) => {
      this.id = Number(params['id']);
      this.edicion = !!this.id;

      if (this.edicion) {
        this.cS.listId(this.id).subscribe((data: Comprobante) => {
          const fecha = data.fechaComprobante ? new Date(data.fechaComprobante) : null;

          this.form.patchValue({
            idComprobante: data.idComprobante,
            numeroComprobante: data.numeroComprobante,
            fechaComprobante: fecha,
            razonSocialComprobante: data.razonSocialComprobante,
            igvComprobante: data.igvComprobante,
            totalComprobante: data.totalComprobante,

            // 👇 Funciona si el backend manda idPlano O un objeto pedido
            pedido: data.idPedido ?? data.pedido?.idPedido ?? null,

            tipoDocumento: data.idTipoDocumento ?? data.tipoDocumento?.idTipoDocumento ?? null,
          });
        });
      }
    });
  }

  aceptar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const body: any = {
      idComprobante: raw.idComprobante,
      numeroComprobante: raw.numeroComprobante,
      fechaComprobante: raw.fechaComprobante
        ? new Date(raw.fechaComprobante).toISOString().substring(0, 10)
        : null,
      razonSocialComprobante: raw.razonSocialComprobante,
      igvComprobante: raw.igvComprobante,
      totalComprobante: raw.totalComprobante,

      // 👇 enviamos solo los IDs
      idPedido: raw.pedido,
      idTipoDocumento: raw.tipoDocumento,
    };

    const obs = this.edicion ? this.cS.update(body) : this.cS.insert(body);

    obs.subscribe({
      next: () => {
        this.cS.list().subscribe((data: Comprobante[]) => {
          this.cS.setList(data);
        });
        this.router.navigate(['comprobante']);
      },
      error: (err) => {
        console.error('Error al guardar comprobante', err);
        alert('Ocurrió un error al guardar el comprobante');
      },
    });
  }
}
