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
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';

import { PedidoItemService } from '../../../services/pedido-item-service';
import { PedidoService } from '../../../services/pedido-service';
import { ProductoService } from '../../../services/producto-service';
import { Pedido } from '../../../models/Pedido';
import { Producto } from '../../../models/Producto';

@Component({
  standalone: true,
  selector: 'app-pedido-item-insert',
  templateUrl: './pedido-item-insert.html',
  styleUrl: './pedido-item-insert.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
})
export class PedidoItemInsertComponent implements OnInit {
  form!: FormGroup;

  listaPedidos: Pedido[] = [];
  listaProductos: Producto[] = [];

  id: number = 0;
  edicion: boolean = false;
  submitted: boolean = false; // <- para saber si ya intentó guardar

  constructor(
    private fb: FormBuilder,
    private piS: PedidoItemService,
    private pS: PedidoService,
    private prS: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Form con validaciones
    this.form = this.fb.group({
      idPedidoItem: [''],
      cantidadPedidoItem: [1, [Validators.required, Validators.min(1)]],
      precioPedidoItem: [0, [Validators.required, Validators.min(0)]],
      pedido: ['', Validators.required],
      producto: ['', Validators.required],
    });

    // Cargar combos
    this.pS.list().subscribe((data) => (this.listaPedidos = data));
    this.prS.list().subscribe((data) => (this.listaProductos = data));

    // Modo edición (si estás usando editar)
    this.route.params.subscribe((params) => {
      this.id = Number(params['id']);
      this.edicion = !!this.id;

      if (this.edicion) {
        this.piS.listId(this.id).subscribe((data) => {
          this.form.patchValue({
            idPedidoItem: data.idPedidoItem,
            cantidadPedidoItem: data.cantidadPedidoItem,
            precioPedidoItem: data.precioPedidoItem,
            pedido: data.pedido.idPedido,
            producto: data.producto.idProducto,
          });
        });
      }
    });
  }

  // Helper para saber si un campo está inválido y mostrar mensaje
  campoInvalido(nombre: string): boolean {
    const control = this.form.get(nombre);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  aceptar() {
    this.submitted = true; // marcamos que intentó guardar

    if (this.form.invalid) {
      // si hay errores, no mandamos nada
      return;
    }

    const body = {
      idPedidoItem: this.edicion ? Number(this.form.value.idPedidoItem) : 0,
      cantidadPedidoItem: this.form.value.cantidadPedidoItem,
      precioPedidoItem: this.form.value.precioPedidoItem,
      pedido: { idPedido: this.form.value.pedido },
      producto: { idProducto: this.form.value.producto },
    };

    if (this.edicion) {
      this.piS.update(body).subscribe(() => {
        this.piS.list().subscribe((data) => this.piS.setList(data));
        this.router.navigate(['pedido-item']);
      });
    } else {
      this.piS.insert(body).subscribe(() => {
        this.piS.list().subscribe((data) => this.piS.setList(data));
        this.router.navigate(['pedido-item']);
      });
    }
  }
}
