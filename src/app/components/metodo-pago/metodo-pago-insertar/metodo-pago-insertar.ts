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

import { MetodoPago } from '../../../models/Metodo-pago';
import { MetodoPagoService } from '../../../services/metodo-pago';

@Component({
  standalone: true,
  selector: 'app-metodo-pago-insertar',
  templateUrl: './metodo-pago-insertar.html',
  styleUrl: './metodo-pago-insertar.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
})
export class MetodoPagoInsertarComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private mS: MetodoPagoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      idMetodoPago: [0],
      nombreMetodoPago: ['', Validators.required],
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
    this.mS.listId(this.id).subscribe((data: MetodoPago) => {
      this.form.patchValue({
        idMetodoPago: data.idMetodoPago,
        nombreMetodoPago: data.nombreMetodoPago,
      });
    });
  }

  aceptar(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    const body: MetodoPago = {
      idMetodoPago: formValue.idMetodoPago,
      nombreMetodoPago: formValue.nombreMetodoPago,
    };

    if (this.edicion) {
      // ACTUALIZAR
      this.mS.update(body).subscribe(() => {
        this.mS.list().subscribe((data) => {
          this.mS.setList(data);              // refresca tabla
          this.router.navigate(['/metodopago']); // vuelve a listar
        });
      });
    } else {
      // REGISTRAR NUEVO
      body.idMetodoPago = 0;
      this.mS.insert(body).subscribe(() => {
        this.mS.list().subscribe((data) => {
          this.mS.setList(data);
          this.router.navigate(['/metodopago']);
        });
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/metodopago']);
  }
}