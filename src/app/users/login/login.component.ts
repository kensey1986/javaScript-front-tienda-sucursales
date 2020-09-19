import { FuncionesService } from './../../generales/services/funciones.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingService } from '../../generales/services/loading.service';
import { SucursalService } from '../../sucursales/services/sucursal.service';
import { Sucursal } from '../../sucursales/interfaces/sucursal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
  usuario: User;
  public  urlEndPoint: string;
  public  rol = 'USUARIO';
  sucursales: Sucursal[];

  opcionSeleccionado  = '';
  verSeleccion = '';

  constructor(
    public authService: AuthService,
    public  router: Router,
    public loadingService: LoadingService,
    public funcionesService: FuncionesService,
    public  sucursalService: SucursalService,
  ) {
    this.usuario = new User();
    this.sucursalService.getSucursalLista()
    .subscribe(sucursales => (this.sucursales = sucursales));
    this.urlEndPoint = `${this.funcionesService.setUrlBase()}`;
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      Swal.fire({
        type: 'info',
        title: '¡Informacion!',
        text: `Hola ${this.authService.usuario.username}`,
        footer: 'ya estás autenticado!',
        });
      this.loadingService.cerrarModal();
      this.router.navigate(['/clientes']);
    }
  }

  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;
}

  login(): void {
    if (this.usuario.username === null || this.usuario.password === null
          || this.usuario.username === undefined || this.usuario.password === undefined ) {
            Swal.fire({
              type: 'error',
              title: 'Error al Logear',
              text: 'El Usuario o el Password vacios',
              footer: 'Intente de nuevo',
              });
            return;
    } else if (this.verSeleccion === null || this.verSeleccion === '' || this.verSeleccion === undefined ) {
      Swal.fire({
        type: 'error',
        title: 'Error al Logear',
        text: 'Debe Selecionar Sucursal',
        footer: 'Intente de nuevo',
        });
      return;

    }
    sessionStorage.removeItem('idpro');
    sessionStorage.setItem('sucursal', JSON.stringify(this.verSeleccion));
    this.loadingService.abrirModal();
    this.authService.login(this.usuario).subscribe(response => {
      // console.log(response);
      // const payload = JSON.parse(atob(response.access_token.split('.')[1]));
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      const usuario = this.authService.usuario;
      if (this.authService.hasRole('ROLE_ADMIN')) {
          this.rol = 'ADMINISTRADOR';
      }
      this.router.navigate(['/clientes']);
      this.loadingService.cerrarModal();
      Swal.fire({
        type: 'success',
        title: 'Bienvenido',
        text: `hola ${usuario.username}, has iniciado sesion con exito!`,
        footer: `Rol  ---${this.rol}--- `,
        });
    }, err => {
      if (err.status === 400) {
        this.loadingService.cerrarModal();
        Swal.fire({
          type: 'error',
          title: 'Error al Logear',
          text: 'El Usuario o el Password Incorrectos',
          footer: 'Intente de nuevo',
          });
      }
    });
  }

}
