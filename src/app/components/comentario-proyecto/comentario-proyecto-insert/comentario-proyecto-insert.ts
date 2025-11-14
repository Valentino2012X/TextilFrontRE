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
import { MatOptionModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ComentarioProyectoService } from '../../../services/comentario-proyecto-service';
import { ProyectoService } from '../../../services/proyecto-service';
import { UsuarioService } from '../../../services/usuario-service';

import { Proyecto } from '../../../models/proyecto';
import { Usuario } from '../../../models/Usuario';
import { ComentarioProyecto } from '../../../models/comentario-proyecto';

@Component({
  standalone: true,
  selector: 'app-comentario-proyecto-insertar',
  templateUrl: './comentario-proyecto-insert.html',
  styleUrl: './comentario-proyecto-insert.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class ComentarioProyectoInsertarComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  listaProyectos: Proyecto[] = [];
  listaUsuarios: Usuario[] = [];

  // solo para mostrar la fecha cuando edites (read-only)
  fechaComentarioTexto: string = '';

  constructor(
    private fb: FormBuilder,
    private cS: ComentarioProyectoService,
    private pS: ProyectoService,
    private uS: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idComentarioProyecto: [''],
      comentarioProyecto: ['', Validators.required],
      proyecto: ['', Validators.required], // idProyecto
      usuario: ['', Validators.required], // idUsuario
    });

    // combos
    this.pS.list().subscribe((data) => (this.listaProyectos = data));
    this.uS.list().subscribe((data) => (this.listaUsuarios = data));

    // edición
    this.route.params.subscribe((params) => {
      this.id = Number(params['id']);
      this.edicion = !!this.id;

      if (this.edicion) {
        // NO hay GET /comentariosproyectos/{id}, así que buscamos en la lista
        this.cS.list().subscribe((lista: ComentarioProyecto[]) => {
          const encontrado = lista.find(
            (c) => c.idComentarioProyecto === this.id
          );
          if (encontrado) {
            // convertir la fecha a texto legible (o simplemente a string)
            this.fechaComentarioTexto = encontrado.fechaComentario
              ? new Date(encontrado.fechaComentario as any)
                  .toISOString()
                  .replace('T', ' ')
                  .substring(0, 16) // yyyy-MM-dd HH:mm
              : '';

            this.form.patchValue({
              idComentarioProyecto: encontrado.idComentarioProyecto,
              comentarioProyecto: encontrado.comentarioProyecto,
              proyecto: encontrado.proyecto?.idProyecto,
              usuario: encontrado.usuario?.idUsuario,
            });
          }
        });
      }
    });
  }

  aceptar() {
    const raw = this.form.value;

    const body = {
      idComentarioProyecto: raw.idComentarioProyecto, // por si edición
      comentarioProyecto: raw.comentarioProyecto,
      proyecto: { idProyecto: raw.proyecto },
      usuario: { idUsuario: raw.usuario },
    };

    const obs = this.edicion
      ? this.cS.update(this.id, body)
      : this.cS.insert(body);

    obs.subscribe(() => {
      this.cS.list().subscribe((data) => this.cS.setList(data));
      this.router.navigate(['comentarioproyecto']);
    });
  }
}
