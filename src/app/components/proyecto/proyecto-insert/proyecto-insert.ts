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

import { ProyectoService } from '../../../services/proyecto-service';
import { TipoProyectoService } from '../../../services/tipo-proyecto-service';
import { UsuarioService } from '../../../services/usuario-service';
import { TipoProyecto } from '../../../models/Tipo-proyecto';
import { Usuario } from '../../../models/Usuario';

@Component({
  standalone: true,
  selector: 'app-proyecto-insertar',
  templateUrl: './proyecto-insert.html',
  styleUrl: './proyecto-insert.css',
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
export class ProyectoInsertarComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  listaTipoProyecto: TipoProyecto[] = [];
  listaUsuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private pS: ProyectoService,
    private tpS: TipoProyectoService,
    private uS: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idProyecto: [''],
      tituloProyecto: ['', Validators.required],
      descripcionProyecto: ['', Validators.required],
      urlProyecto: ['', Validators.required],
      visibleProyecto: ['', Validators.required],
      fechaCreacion: [null, Validators.required],
      tipoProyecto: ['', Validators.required], // idTipoProyecto
      usuario: ['', Validators.required], // idUsuario
    });

    // Cargar combos
    this.tpS.list().subscribe((data) => (this.listaTipoProyecto = data));
    this.uS.list().subscribe((data) => (this.listaUsuarios = data));

    // Modo edición
    this.route.params.subscribe((params) => {
      this.id = Number(params['id']);
      this.edicion = !!this.id;

      if (this.edicion) {
        this.pS.listId(this.id).subscribe((data: any) => {
          const fecha = data.fechaCreacion ? new Date(data.fechaCreacion) : null;

          this.form.patchValue({
            idProyecto: data.idProyecto,
            tituloProyecto: data.tituloProyecto,
            descripcionProyecto: data.descripcionProyecto,
            urlProyecto: data.urlProyecto,
            visibleProyecto: data.visibleProyecto,
            fechaCreacion: fecha,
            // 👇 ahora usamos los IDs planos que manda el backend
            tipoProyecto: data.idTipoProyecto,
            usuario: data.idUsuario,
          });
        });
      }
    });
  }

  aceptar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const body: any = {
      idProyecto: raw.idProyecto,
      tituloProyecto: raw.tituloProyecto,
      descripcionProyecto: raw.descripcionProyecto,
      urlProyecto: raw.urlProyecto,
      visibleProyecto: raw.visibleProyecto,
      fechaCreacion: raw.fechaCreacion
        ? new Date(raw.fechaCreacion).toISOString().substring(0, 10)
        : null,
      tipoProyecto: { idTipoProyecto: raw.tipoProyecto },
      usuario: { idUsuario: raw.usuario },
    };

    const obs = this.edicion ? this.pS.update(body) : this.pS.insert(body);

    obs.subscribe({
      next: () => {
        this.pS.list().subscribe((data) => this.pS.setList(data));
        this.router.navigate(['proyecto']);
      },
      error: (err) => {
        console.error('Error al guardar proyecto', err);
        alert('Ocurrió un error al guardar el proyecto.');
      },
    });
  }
}
