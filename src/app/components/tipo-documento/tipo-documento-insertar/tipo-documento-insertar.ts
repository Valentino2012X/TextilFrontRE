import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { TipoDocumento } from '../../../models/Tipo-documento';
import { TipoDocumentoService } from '../../../services/tipo-documento-service';

@Component({
  standalone: true,
  selector: 'app-tipo-documento-insertar',
  templateUrl: './tipo-documento-insertar.html',
  styleUrl: './tipo-documento-insertar.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
})
export class TipoDocumentoInsertarComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private tdS: TipoDocumentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      idTipoDocumento: [0],
      nombre: ['', Validators.required],
      descripcionTipoDocumento: [''],
      rucTipoDocumento: [''],
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      if (this.edicion) {
        this.init();
      }
    });
  }

  init(): void {
    this.tdS.listId(this.id).subscribe((data: TipoDocumento) => {
      this.form.patchValue({
        idTipoDocumento: data.idTipoDocumento,
        nombre: data.nombre,
        descripcionTipoDocumento: data.descripcionTipoDocumento,
        rucTipoDocumento: data.rucTipoDocumento,
      });
    });
  }

  aceptar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const body: TipoDocumento = {
      idTipoDocumento: formValue.idTipoDocumento,
      nombre: formValue.nombre,
      descripcionTipoDocumento: formValue.descripcionTipoDocumento,
      rucTipoDocumento: formValue.rucTipoDocumento
        ? Number(formValue.rucTipoDocumento)
        : null,
    };

    if (this.edicion) {
      // ACTUALIZAR
      this.tdS.update(body).subscribe({
        next: () => {
          this.tdS.list().subscribe((data) => {
            this.tdS.setList(data); // refresca tabla
            this.router.navigate(['/tipodocumento']);
          });
        },
        error: (err) => {
          console.error('Error al actualizar tipo de documento', err);
          alert('Ocurrió un error al actualizar el tipo de documento');
        },
      });
    } else {
      // REGISTRAR NUEVO
      body.idTipoDocumento = 0;
      this.tdS.insert(body).subscribe({
        next: () => {
          this.tdS.list().subscribe((data) => {
            this.tdS.setList(data);
            this.router.navigate(['/tipodocumento']);
          });
        },
        error: (err) => {
          console.error('Error al registrar tipo de documento', err);
          alert('Ocurrió un error al registrar el tipo de documento');
        },
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/tipodocumento']);
  }
}
