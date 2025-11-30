import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoProyectoService } from '../../../services/tipo-proyecto-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-tipo-proyecto-insertar',
  templateUrl: './tipo-proyecto-insert.html',
  styleUrl: './tipo-proyecto-insert.css',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule,],
})
export class TipoProyectoInsertarComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tpS: TipoProyectoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idTipoProyecto: [''],
      nombreTipoProyecto: ['', Validators.required],
    });

    this.route.params.subscribe((params) => {
      this.id = Number(params['id']);
      this.edicion = !!this.id;

      if (this.edicion) {
        this.tpS.listId(this.id).subscribe((data) => {
          this.form.patchValue({
            idTipoProyecto: data.idTipoProyecto,
            nombreTipoProyecto: data.nombreTipoProyecto,
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

    const body = {
      idTipoProyecto: Number(this.form.value.idTipoProyecto),
      nombreTipoProyecto: this.form.value.nombreTipoProyecto,
    };

    if (this.edicion) {
      this.tpS.update(body).subscribe(() => {
        this.tpS.list().subscribe((data) => this.tpS.setList(data));
      });
    } else {
      this.tpS.insert(body).subscribe(() => {
        this.tpS.list().subscribe((data) => this.tpS.setList(data));
      });
    }

    this.router.navigate(['tipoproyecto']);
  }

  cancelar(): void {
    this.router.navigate(['tipoproyecto']);
  }
}
