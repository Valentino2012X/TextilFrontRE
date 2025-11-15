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
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

import { ProductoFotoService } from '../../../services/producto-foto';
import { ProductoService } from '../../../services/producto-service';

import { Producto } from '../../../models/Producto';
import { ProductoFoto } from '../../../models/producto-foto';

@Component({
  standalone: true,
  selector: 'app-producto-foto-insertar',
  templateUrl: './producto-foto-insert.html',
  styleUrl: './producto-foto-insert.css',
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
export class ProductoFotoInsertarComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  listaProductos: Producto[] = [];

  constructor(
    private fb: FormBuilder,
    private pfS: ProductoFotoService,
    private pS: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const hoy = new Date();

    this.form = this.fb.group({
      idProductoFoto: [0],
      urlProductoFoto: ['', [Validators.required, Validators.maxLength(255)]],
      principalProductoFoto: [false, Validators.required],
      fechaSubidaProductoFoto: [hoy, Validators.required],
      idProducto: [null, Validators.required],
    });

    // combos
    this.pS.list().subscribe((data) => (this.listaProductos = data));

    // edición
    this.route.params.subscribe((params: Params) => {
      this.id = Number(params['id']);
      this.edicion = this.id > 0;

      if (this.edicion) {
        this.pfS.listId(this.id).subscribe((data: ProductoFoto) => {
          const fecha = data.fechaSubidaProductoFoto
            ? new Date(data.fechaSubidaProductoFoto as any)
            : hoy;

          this.form.patchValue({
            idProductoFoto: data.idProductoFoto,
            urlProductoFoto: data.urlProductoFoto,
            principalProductoFoto: data.principalProductoFoto,
            fechaSubidaProductoFoto: fecha,
            idProducto: data.producto?.idProducto ?? null,
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
    const idForm = Number(raw.idProductoFoto) || 0;

    const body: any = {
      idProductoFoto: this.edicion ? idForm : 0,
      urlProductoFoto: raw.urlProductoFoto,
      principalProductoFoto: raw.principalProductoFoto,
      fechaSubidaProductoFoto: this.formatDate(
        raw.fechaSubidaProductoFoto as Date
      ),
      producto: {
        idProducto: raw.idProducto,
      },
    };

    const esUpdate = this.edicion && idForm > 0;

    const peticion = esUpdate
      ? this.pfS.update(body)
      : this.pfS.insert(body);

    peticion.subscribe({
      next: () => {
        this.pfS.list().subscribe((data) => this.pfS.setList(data));
        this.router.navigate(['productofoto']);
      },
      error: (err) => {
        console.error('Error al guardar foto de producto', err);
        alert(err.error || 'Ocurrió un error al guardar la foto de producto');
      },
    });
  }
}
