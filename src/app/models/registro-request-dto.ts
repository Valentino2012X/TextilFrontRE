export class RegistroRequestDTO {
  username: string = '';
  password: string = '';
  nombre: string = '';
  email: string = '';
  rolNombre: 'VENDEDOR' | 'ESTUDIANTE' = 'ESTUDIANTE';
}
