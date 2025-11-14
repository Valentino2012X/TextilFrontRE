import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { RolService } from '../../../services/rol-service';
import { Rol } from '../../../models/Rol';

@Component({
  standalone: true,
  selector: 'app-rol-listar',
  templateUrl: './rol-listar.html',
  styleUrl: './rol-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class RolListarComponent implements OnInit {
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource<Rol>();

  displayedColumns: string[] = ['idRol', 'nombreRol', 'acciones'];

  constructor(private rS: RolService) {}

  ngOnInit(): void {
    // Primera carga
    this.rS.list().subscribe((data: Rol[]) => {
      this.dataSource = new MatTableDataSource(data);
    });

    // Suscripción para refrescar
    this.rS.getList().subscribe((data: Rol[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este rol?')) return;

    this.rS.delete(id).subscribe({
      next: () => {
        this.rS.list().subscribe((data: Rol[]) => {
          this.rS.setList(data);
        });
      },
      error: (err) => {
        if (err.status === 409) {
          alert(err.error); // por si el rol está asociado a usuarios, etc.
        } else if (err.status === 404) {
          alert('El rol ya no existe (404).');
        } else {
          alert('Ocurrió un error al eliminar el rol.');
        }
      },
    });
  }
}
