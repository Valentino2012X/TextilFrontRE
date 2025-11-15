import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';

import { UsuarioService } from '../../../services/usuario-service';
import { RolService } from '../../../services/rol-service';
import { Rol } from '../../../models/Rol';

@Component({
  selector: 'app-usuario-insert',
  standalone: true,
  templateUrl: './usuario-insert.html',
  styleUrl: './usuario-insert.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatOptionModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class UsuarioInsertComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  listaRoles: Rol[] = [];

  edicion: boolean = false;
  id: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private uS: UsuarioService,
    private rS: RolService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // cargar roles para el combo
    this.rS.list().subscribe((data: Rol[]) => {
      this.listaRoles = data;
    });

    this.form = this.formBuilder.group({
      idUsuario: [''],
      nombreUsuario: ['', Validators.required],
      emailUsuario: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      telefonoUsuario: ['', Validators.required],
      direccionUsuario: ['', Validators.required],
      fechaRegistroUsuario: ['', Validators.required],
      enabled: [true],

      // 🔹 campos de calificación
      promedioCalificacion: [0, [Validators.required, Validators.min(0)]],
      totalCalificacion: [0, [Validators.required, Validators.min(0)]],

      idRol: [null, Validators.required], // rol obligatorio
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });
  }

  aceptar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      idUsuario: this.form.value.idUsuario,
      nombreUsuario: this.form.value.nombreUsuario,
      emailUsuario: this.form.value.emailUsuario,
      username: this.form.value.username,
      password: this.form.value.password,
      telefonoUsuario: this.form.value.telefonoUsuario,
      direccionUsuario: this.form.value.direccionUsuario,
      fechaRegistroUsuario: this.form.value.fechaRegistroUsuario,
      enabled: this.form.value.enabled,

      // 🔹 aseguramos que vayan como número
      promedioCalificacion: Number(this.form.value.promedioCalificacion),
      totalCalificacion: Number(this.form.value.totalCalificacion),

      idRol: this.form.value.idRol,
    };

    if (this.edicion) {
      this.uS.update(body).subscribe(() => {
        this.uS.list().subscribe((data) => {
          this.uS.setList(data);
        });
      });
    } else {
      this.uS.insert(body).subscribe(() => {
        this.uS.list().subscribe((data) => {
          this.uS.setList(data);
        });
      });
    }

    this.router.navigate(['usuarios']);
  }

  cancelar(): void {
    this.router.navigate(['usuarios']);
  }

  init(): void {
    if (this.edicion) {
      this.uS.listId(this.id).subscribe((data: any) => {
        this.form.patchValue({
          idUsuario: data.idUsuario,
          nombreUsuario: data.nombreUsuario,
          emailUsuario: data.emailUsuario,
          username: data.username,
          password: data.password,
          telefonoUsuario: data.telefonoUsuario,
          direccionUsuario: data.direccionUsuario,
          fechaRegistroUsuario: data.fechaRegistroUsuario,
          enabled: data.enabled,
          promedioCalificacion: data.promedioCalificacion,
          totalCalificacion: data.totalCalificacion,
          idRol: data.idRol ?? data.rol?.idRol,
        });
      });
    }
  }
}
