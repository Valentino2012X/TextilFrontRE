import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { UsuarioListarComponent } from './usuario-listar/usuario-listar';

@Component({
  selector: 'app-usuario',
  standalone: true,
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
  imports: [RouterOutlet, UsuarioListarComponent],
})
export class UsuarioComponent {
  constructor(public route: ActivatedRoute) {}
}
