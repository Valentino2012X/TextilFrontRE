import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { FavoritoService } from '../../../services/favorito';
import { Favorito } from '../../../models/favorito';

@Component({
  standalone: true,
  selector: 'app-favorito-listar',
  templateUrl: './favorito-listar.html',
  styleUrl: './favorito-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink, NgIf],
})
export class FavoritoListarComponent implements OnInit {
  dataSource: MatTableDataSource<Favorito> = new MatTableDataSource<Favorito>();

  displayedColumns: string[] = [
    'idFavorito',
    'fechaFavorito',
    'usuario',
    'producto',
    'proyecto',
    'acciones',
  ];

  constructor(private fS: FavoritoService) {}

  ngOnInit(): void {
    this.fS.list().subscribe((data: Favorito[]) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.fS.getList().subscribe((data: Favorito[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este favorito?')) return;

    this.fS.delete(id).subscribe(() => {
      this.fS.list().subscribe((data: Favorito[]) => {
        this.fS.setList(data);
      });
    });
  }
}
