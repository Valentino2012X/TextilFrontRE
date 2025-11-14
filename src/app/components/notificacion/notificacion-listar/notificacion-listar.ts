import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { NotificacionService } from '../../../services/notificacion-service';
import { Notificacion } from '../../../models/Notificacion';

@Component({
  standalone: true,
  selector: 'app-notificacion-listar',
  templateUrl: './notificacion-listar.html',
  styleUrl: './notificacion-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class NotificacionListarComponent implements OnInit {
  dataSource: MatTableDataSource<Notificacion> =
    new MatTableDataSource<Notificacion>();

  displayedColumns: string[] = [
    'idNotificacion',
    'tipoNotificacion',
    'mensajeNotificacion',
    'fechaNotificacion',
    'usuario',
    'acciones',
  ];

  constructor(private nS: NotificacionService) {}

  ngOnInit(): void {
    this.nS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.nS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    const confirmar = confirm('¿Seguro que deseas eliminar esta notificación?');
    if (!confirmar) {
      return;
    }

    this.nS.delete(id).subscribe({
      next: () => {
        this.nS.list().subscribe((data) => this.nS.setList(data));
      },
      error: (err) => {
        if (err.status === 409) {
          alert(err.error);
        } else if (err.status === 404) {
          alert('El registro ya no existe (404).');
        } else {
          alert('Ocurrió un error al eliminar la notificación.');
        }
      },
    });
  }
}
