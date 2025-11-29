import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { TipoProductoService } from '../../../services/tipo-producto-service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  selector: 'app-tipo-producto-insertar',
  templateUrl: './tipo-producto-insert.html',
  styleUrl: './tipo-producto-insert.css',
})
export class TipoProductoInsertarComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tS: TipoProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idTipoProducto: [''],
      nombreTipoProducto: ['', Validators.required],
    });

    this.route.params.subscribe((data) => {
      this.id = Number(data['id']);
      this.edicion = !!this.id;

      if (this.edicion) {
        this.tS.listId(this.id).subscribe((data) => {
          this.form.patchValue({
            idTipoProducto: data.idTipoProducto,
            nombreTipoProducto: data.nombreTipoProducto,
          });
        });
      }
    });
  }

  aceptar() {
    // ✅ VALIDACIÓN (no guarda si está mal)
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let body = {
      idTipoProducto: Number(this.form.value.idTipoProducto),
      nombreTipoProducto: this.form.value.nombreTipoProducto,
    };

    if (this.edicion) {
      this.tS.update(body).subscribe(() => {
        this.tS.list().subscribe((data) => this.tS.setList(data));
      });
    } else {
      this.tS.insert(body).subscribe(() => {
        this.tS.list().subscribe((data) => this.tS.setList(data));
      });
    }

    this.router.navigate(['tipoproducto']);
  }

  cancelar(): void {
    this.router.navigate(['tipoproducto']);
  }
}
