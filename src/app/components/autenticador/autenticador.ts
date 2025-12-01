import { Component, OnInit } from '@angular/core';
import { JwtRequestDTO } from '../../models/jwtRequestDTO';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-autenticador',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './autenticador.html',
  styleUrl: './autenticador.css',
})
export class Autenticador implements OnInit {
  username: string = '';
  password: string = '';
  mensaje: string = '';

  private redirectUrl: string | null = null;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // si venías de una ruta protegida, el guard envía ?redirect=/algo
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect');
  }

  cerrar(): void {
    this.router.navigate(['/home']);
  }

  login(): void {
    const u = (this.username || '').trim();
    const p = (this.password || '').trim();

    if (!u && !p) {
      this.snackBar.open('Completa tu usuario y contraseña.', 'Aviso', { duration: 2500 });
      return;
    }
    if (!u) {
      this.snackBar.open('El campo "Usuario" está vacío.', 'Aviso', { duration: 2500 });
      return;
    }
    if (!p) {
      this.snackBar.open('El campo "Contraseña" está vacío.', 'Aviso', { duration: 2500 });
      return;
    }

    const request = new JwtRequestDTO();
    request.username = u;
    request.password = p;

    this.loginService.login(request).subscribe(
      (data: any) => {
        const token = data?.jwttoken;
        if (!token) {
          this.snackBar.open('No se recibió token del backend.', 'Aviso', { duration: 2500 });
          return;
        }

        // ✅ Guardar token usando el servicio (localStorage)
        this.loginService.setToken(token);

        // username para el landing
        localStorage.setItem('username', data?.username || u);
        if (data?.nombreUsuario) localStorage.setItem('nombreUsuario', data.nombreUsuario);

        // rol (si llega)
        if (data?.rol) localStorage.setItem('rol', data.rol);

        const authorities = data?.authorities || data?.roles;
        if (authorities?.length) {
          const first = authorities[0];
          const rol =
            typeof first === 'string' ? first : first?.authority || first?.nombreRol || '';
          if (rol) localStorage.setItem('rol', rol);
        }

        // ✅ ir a donde pedía el guard, o a dashboard
        if (this.redirectUrl) this.router.navigateByUrl(this.redirectUrl);
        else this.router.navigate(['/dashboard']);
      },
      () => {
        this.mensaje = 'Usuario o contraseña incorrectos.';
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 2500 });
      }
    );
  }
}
