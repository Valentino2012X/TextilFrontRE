import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { RolService } from '../../../services/rol-service';
import { Rol } from '../../../models/Rol';

@Component({
  standalone: true,
  selector: 'app-rol-insertar',
  templateUrl: './rol-insert.html',
  styleUrl: './rol-insert.css',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule],
})
export class RolInsertarComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private rS: RolService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      idRol: [''],
      nombreRol: ['', Validators.required],
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;

      if (this.edicion) {
        this.rS.listId(this.id).subscribe((data: Rol) => {
          this.form.patchValue({
            idRol: data.idRol,
            nombreRol: data.nombreRol,
          });
        });
      }
    });
  }

  aceptar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Para nuevo: solo mandamos nombreRol
    // Para edición: también mandamos idRol
    const rol: Rol = {
      nombreRol: this.form.value.nombreRol,
    };

    if (this.edicion) {
      rol.idRol = this.form.value.idRol;
      this.rS.update(rol).subscribe({
        next: () => {
          this.rS.list().subscribe((data: Rol[]) => {
            this.rS.setList(data);
          });
          this.router.navigate(['roles']);
        },
        error: (err) => {
          console.error('Error al actualizar rol', err);
          if (err.status === 404) {
            alert(err.error); // "No se puede modificar. No existe..."
          } else if (err.status === 409) {
            alert(err.error); // "Ya existe un rol con el nombre..."
          } else {
            alert('Ocurrió un error al actualizar el rol');
          }
        },
      });
    } else {
      this.rS.insert(rol).subscribe({
        next: () => {
          this.rS.list().subscribe((data: Rol[]) => {
            this.rS.setList(data);
          });
          this.router.navigate(['roles']);
        },
        error: (err) => {
          console.error('Error al registrar rol', err);
          if (err.status === 409) {
            alert(err.error); // "Ya existe un rol con el nombre..."
          } else {
            alert('Ocurrió un error al registrar el rol');
          }
        },
      });
    }
  }
}
