import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

  // 🔹 Upload de foto (modo admin)
  selectedFile?: File;
  previewUrl: string | null = null;
  subiendo = false;
  uploadError = '';
  uploadSuccess = '';

  constructor(
    private formBuilder: FormBuilder,
    private uS: UsuarioService,
    private rS: RolService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rS.list().subscribe((data: Rol[]) => {
      this.listaRoles = data;
    });

    this.form = this.formBuilder.group({
      idUsuario: [''],
      nombreUsuario: ['', Validators.required],
      emailUsuario: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telefonoUsuario: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern(/^\d+$/),
        ],
      ],
      direccionUsuario: ['', Validators.required],
      fechaRegistroUsuario: [{ value: new Date(), disabled: true }],
      enabled: [true],

      promedioCalificacion: [0, [Validators.required, Validators.min(0), Validators.max(20)]],
      totalCalificacion: [0, [Validators.required, Validators.min(0)]],

      idRol: [null, Validators.required],

      // opcional
      fotoUrl: [''],
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;

      if (this.edicion) {
        const passCtrl = this.form.get('password');
        passCtrl?.clearValidators();
        passCtrl?.setValue('');
        passCtrl?.updateValueAndValidity();
      }

      this.init();
    });
  }

  aceptar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const body: any = {
      idUsuario: this.form.value.idUsuario,
      nombreUsuario: this.form.value.nombreUsuario,
      emailUsuario: this.form.value.emailUsuario,
      username: this.form.value.username,
      telefonoUsuario: this.form.value.telefonoUsuario,
      direccionUsuario: this.form.value.direccionUsuario,
      fechaRegistroUsuario: raw.fechaRegistroUsuario ?? new Date(),
      enabled: this.form.value.enabled,
      promedioCalificacion: Number(this.form.value.promedioCalificacion),
      totalCalificacion: Number(this.form.value.totalCalificacion),
      idRol: this.form.value.idRol,

      // si el admin mete una URL manual
      fotoUrl: this.form.value.fotoUrl || null,
    };

    if (!this.edicion) {
      body.password = this.form.value.password;
    }

    if (this.edicion) {
      this.uS.update(body).subscribe(() => {
        this.uS.list().subscribe((data) => {
          this.uS.setList(data);
        });
        this.router.navigate(['usuarios']);
      });
    } else {
      this.uS.insert(body).subscribe(() => {
        this.uS.list().subscribe((data) => {
          this.uS.setList(data);
        });
        this.router.navigate(['usuarios']);
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['usuarios']);
  }

  get telefono() {
    return this.form.get('telefonoUsuario');
  }

  init(): void {
    if (this.edicion) {
      this.uS.listId(this.id).subscribe((data: any) => {
        let fechaLocal: Date | null = null;
        if (data.fechaRegistroUsuario) {
          const iso = data.fechaRegistroUsuario.toString();
          const yyyyMmDd = iso.substring(0, 10);
          const parts = yyyyMmDd.split('-');
          if (parts.length === 3) {
            const y = Number(parts[0]);
            const m = Number(parts[1]);
            const d = Number(parts[2]);
            fechaLocal = new Date(y, m - 1, d);
          } else {
            const dt = new Date(iso);
            fechaLocal = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
          }
        }

        this.form.patchValue({
          idUsuario: data.idUsuario,
          nombreUsuario: data.nombreUsuario,
          emailUsuario: data.emailUsuario,
          username: data.username,
          telefonoUsuario: data.telefonoUsuario,
          direccionUsuario: data.direccionUsuario,
          fechaRegistroUsuario: fechaLocal,
          enabled: data.enabled,
          promedioCalificacion: data.promedioCalificacion,
          totalCalificacion: data.totalCalificacion,
          idRol: data.idRol ?? data.rol?.idRol,
          fotoUrl: data.fotoUrl,
        });

        // preview inicial (si ya tenía fotoUrl)
        if (data.fotoUrl) {
          this.previewUrl = data.fotoUrl;
        }
      });
    }
  }

  // ====== MANEJO DE FOTO DE PERFIL (UPLOAD ADMIN) ======

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = undefined;
      return;
    }

    this.selectedFile = input.files[0];
    this.uploadError = '';
    this.uploadSuccess = '';

    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  subirFoto(): void {
    if (!this.edicion || !this.id || !this.selectedFile) return;

    this.subiendo = true;
    this.uploadError = '';
    this.uploadSuccess = '';

    this.uS.uploadFoto(this.id, this.selectedFile).subscribe({
      next: (url: string) => {
        this.subiendo = false;
        this.uploadSuccess = 'Foto actualizada correctamente.';

        // actualizamos form y preview con la URL real
        this.form.patchValue({ fotoUrl: url });
        this.previewUrl = url;
        this.selectedFile = undefined;
      },
      error: (err) => {
        this.subiendo = false;
        console.error(err);
        this.uploadError =
          (typeof err?.error === 'string' && err.error) ||
          'Ocurrió un error al subir la foto.';
      },
    });
  }
}
