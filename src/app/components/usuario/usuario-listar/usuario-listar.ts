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

  displayedColumns: string[] = [
    'idUsuario',
    'nombreUsuario',
    'emailUsuario',
    'username',
    'telefonoUsuario',
    'rol',
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
    this.uS.delete(id).subscribe(() => {
      this.uS.list().subscribe((data: Usuario[]) => {
        this.uS.setList(data);
      });
    });
  }
}
