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
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';

import { FavoritoService } from '../../../services/favorito';
import { UsuarioService } from '../../../services/usuario-service';
import { ProductoService } from '../../../services/producto-service';
import { ProyectoService } from '../../../services/proyecto-service';

import { Usuario } from '../../../models/Usuario';
import { Producto } from '../../../models/Producto';
import { Proyecto } from '../../../models/Proyecto';
import { Favorito } from '../../../models/favorito';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-favorito-insertar',
  templateUrl: './favorito-insert.html',
  styleUrl: './favorito-insert.css',
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
export class FavoritoInsertarComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  listaUsuarios: Usuario[] = [];
  listaProductos: Producto[] = [];
  listaProyectos: Proyecto[] = [];

  constructor(
    private fb: FormBuilder,
    private fS: FavoritoService,
    private uS: UsuarioService,
    private pS: ProductoService,
    private prS: ProyectoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const hoy = new Date();

    this.form = this.fb.group({
      idFavorito: [0],
      fechaFavorito: [hoy, Validators.required],
      idUsuario: [null, Validators.required],
      idProducto: [null],
      idProyecto: [null],
    });

    this.uS.list().subscribe((data) => (this.listaUsuarios = data));
    this.pS.list().subscribe((data) => (this.listaProductos = data));
    this.prS.list().subscribe((data) => (this.listaProyectos = data));

    this.route.params.subscribe((params: Params) => {
      this.id = Number(params['id']);
      this.edicion = this.id > 0;

      if (this.edicion) {
        this.fS.listId(this.id).subscribe((data: Favorito) => {
          const fecha = data.fechaFavorito
            ? new Date(data.fechaFavorito as any)
            : hoy;

          this.form.patchValue({
            idFavorito: data.idFavorito,
            fechaFavorito: fecha,
            idUsuario: data.usuario?.idUsuario ?? null,
            idProducto: data.producto?.idProducto ?? null,
            idProyecto: data.proyecto?.idProyecto ?? null,
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
    const idForm = Number(raw.idFavorito) || 0;

    const body: any = {
      idFavorito: idForm,
      fechaFavorito: this.formatDate(raw.fechaFavorito),
      usuario: {
        idUsuario: raw.idUsuario,
      },
      producto: raw.idProducto ? { idProducto: raw.idProducto } : null,
      proyecto: raw.idProyecto ? { idProyecto: raw.idProyecto } : null,
    };

    const peticion: Observable<any> =
      idForm > 0 ? this.fS.update(body) : this.fS.insert(body);

    peticion.subscribe({
      next: () => {
        this.fS.list().subscribe((data: Favorito[]) => this.fS.setList(data));
        this.router.navigate(['favorito']);
      },
      error: (err: any) => {
        console.error('Error al guardar favorito', err);
        alert(err.error || 'Ocurrió un error al guardar el favorito');
      },
    });
  }
}
