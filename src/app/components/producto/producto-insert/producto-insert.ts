import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ProductoService } from '../../../services/producto-service';
import { TipoProductoService } from '../../../services/tipo-producto-service';
import { UsuarioService } from '../../../services/usuario-service';

import { TipoProducto } from '../../../models/Tipo-producto';
import { Usuario } from '../../../models/Usuario';

@Component({
  standalone: true,
  selector: 'app-producto-insert',
  templateUrl: './producto-insert.html',
  styleUrl: './producto-insert.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
})
export class ProductoInsertarComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  listaTipoProducto: TipoProducto[] = [];
  listaUsuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private pS: ProductoService,
    private tpS: TipoProductoService,
    private uS: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idProducto: [''],
      nombreProducto: ['', Validators.required],
      descripcionProducto: [
        '',
        [Validators.required, Validators.maxLength(200), Validators.minLength(10)],
      ],
      precioProducto: [0, [Validators.required, Validators.min(0)]],
      stockProducto: [0, [Validators.required, Validators.min(0)]],
      colorProducto: [],
      medidaProducto: ['', Validators.required],
      categoriaProducto: ['', Validators.required],
      disponibleProducto: [true, Validators.required],
      urlTipoProducto: ['', Validators.required],
      tipoProducto: ['', Validators.required], // guarda el ID
      usuario: ['', Validators.required], // guarda el ID
    });

    // Cargar combos
    this.tpS.list().subscribe((data) => {
      this.listaTipoProducto = data;
    });

    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
    });

    // Ver si es edición
    this.route.params.subscribe((params) => {
      this.id = Number(params['id']);
      this.edicion = !!this.id;

      if (this.edicion) {
        this.pS.listId(this.id).subscribe((data) => {
          // data viene del GET /productos/{id} con el JSON plano:
          // { ..., idTipoProducto, idUsuario }
          this.form.patchValue({
            idProducto: data.idProducto,
            nombreProducto: data.nombreProducto,
            descripcionProducto: data.descripcionProducto,
            precioProducto: data.precioProducto,
            stockProducto: data.stockProducto,
            colorProducto: data.colorProducto,
            medidaProducto: data.medidaProducto,
            categoriaProducto: data.categoriaProducto,
            disponibleProducto: data.disponibleProducto,
            urlTipoProducto: data.urlTipoProducto,
            tipoProducto: data.idTipoProducto, // 👈 id numérico
            usuario: data.idUsuario, // 👈 id numérico
          });
        });
      }
    });
  }

  aceptar() {
    const fv = this.form.value;

    const body = {
      idProducto: this.edicion ? this.id : 0,
      nombreProducto: fv.nombreProducto,
      descripcionProducto: fv.descripcionProducto,
      precioProducto: Number(fv.precioProducto),
      stockProducto: Number(fv.stockProducto),
      colorProducto: fv.colorProducto,
      medidaProducto: fv.medidaProducto,
      categoriaProducto: fv.categoriaProducto,
      disponibleProducto: fv.disponibleProducto,
      urlTipoProducto: fv.urlTipoProducto,
      tipoProducto: { idTipoProducto: Number(fv.tipoProducto) },
      usuario: { idUsuario: Number(fv.usuario) },
    };

    if (this.edicion) {
      this.pS.update(body).subscribe(() => {
        this.pS.list().subscribe((data) => this.pS.setList(data));
      });
    } else {
      this.pS.insert(body).subscribe(() => {
        this.pS.list().subscribe((data) => this.pS.setList(data));
      });
    }

    this.router.navigate(['producto']);
  }
  cancelar(): void {
    this.router.navigate(['producto']);
  }
}
