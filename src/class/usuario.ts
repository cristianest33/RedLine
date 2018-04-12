import { Rol } from './'
export class Usuario {

  nombreUsuario: string;
  password: string;
  rol: Rol[];
  recuerdame: boolean

  constructor(nombreUsuario: string, password: string, nombreRol?: string, descripcionRol?: string) {
    this.nombreUsuario = nombreUsuario;
    this.password = password;
    this.rol = [{nombreRol: nombreRol, descripcionRol: descripcionRol}]
    this.recuerdame = false;
  }
}
