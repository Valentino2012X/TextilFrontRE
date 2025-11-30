import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { UsuarioService } from '../../../services/usuario-service';
import { Usuario } from '../../../models/Usuario';

@Component({
  standalone: true,
  selector: 'app-usuario-listar',
  templateUrl: './usuario-listar.html',
  styleUrl: './usuario-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class UsuarioListarComponent implements OnInit {
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>();

  // 👇 CAMBIO: usamos ids de columna "promedio" y "total"
  displayedColumns: string[] = [
    'idUsuario',
    'nombreUsuario',
    'emailUsuario',
    'username',
    'telefonoUsuario',
    'rol',
    'promedio',
    'total',
    'acciones',
  ];

  constructor(private uS: UsuarioService) {}

  ngOnInit(): void {
    this.uS.list().subscribe((data: Usuario[]) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.uS.getList().subscribe((data: Usuario[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    console.log('Intentando eliminar usuario con id', id);

    this.uS.delete(id).subscribe({
      next: (resp) => {
        console.log('Respuesta del backend al eliminar:', resp);

        // Recargar lista desde el backend
        this.uS.list().subscribe((data: Usuario[]) => {
          console.log('Lista actualizada después de eliminar', data);
          this.uS.setList(data);
        });
      },
      error: (err) => {
        console.error('Error al eliminar usuario', err);
        alert(err.error || 'Error al eliminar usuario');
      },
    });
  }
}
