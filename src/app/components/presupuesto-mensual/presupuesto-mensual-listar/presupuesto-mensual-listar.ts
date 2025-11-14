import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';

import { PresupuestoMensualService } from '../../../services/presupuesto-mensual-service';
import { Usuario } from '../../../models/Usuario';
import { PresupuestoMensual } from '../../../models/Presupuesto-mensual';

@Component({
  standalone: true,
  selector: 'app-presupuesto-mensual-listar',
  templateUrl: './presupuesto-mensual-listar.html',
  styleUrl: './presupuesto-mensual-listar.css',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
})
export class PresupuestoMensualListarComponent implements OnInit {
  dataSource = new MatTableDataSource<PresupuestoMensual>();

  displayedColumns: string[] = [
    'idPresupuestoMensual',
    'anioPresupuestoMensual',
    'mesPresupuestoMensual',
    'montoLimitePresupuestoMensual',
    'fechaPresupuestoMensual',
    'usuario',
    'acciones',
  ];

  meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  constructor(
    private pmS: PresupuestoMensualService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pmS.list().subscribe((data) => {
      this.ensureUsuario(data);
      this.dataSource = new MatTableDataSource(data);
    });

    this.pmS.getList().subscribe((data) => {
      this.ensureUsuario(data);
      this.dataSource = new MatTableDataSource(data);
    });
  }

  private ensureUsuario(lista: PresupuestoMensual[]) {
    for (const item of lista) {
      if (!item.usuario) {
        item.usuario = new Usuario();
      }
    }
  }

  getNombreMes(numero: number): string {
    const index = numero - 1;
    if (index >= 0 && index < this.meses.length) {
      return this.meses[index];
    }
    return '' + numero;
  }

  eliminar(id: number) {
    const confirmar = confirm(
      '¿Seguro que deseas eliminar este presupuesto mensual?'
    );
    if (!confirmar) {
      return;
    }

    this.pmS.delete(id).subscribe({
      next: () => {
        this.pmS.list().subscribe((data) => this.pmS.setList(data));
      },
      error: (err) => {
        if (err.status === 409) {
          alert(err.error);
        } else if (err.status === 404) {
          alert('El registro ya no existe (404).');
        } else {
          alert('Ocurrió un error al eliminar el presupuesto.');
        }
      },
    });
  }
}
