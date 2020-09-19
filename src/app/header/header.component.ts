import { FuncionesService } from './../generales/services/funciones.service';
import { Component } from '@angular/core';
import { AuthService } from '../users/services/auth.service';
import { Router } from '@angular/router';
import { SucursalService } from './../sucursales/services/sucursal.service';
import { Sucursal } from './../sucursales/interfaces/sucursal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  public  urlEndPoint: string;
  constructor(
    public authService: AuthService,
    public  router: Router,
    public  sucursalService: SucursalService,
    public funcionesService: FuncionesService
    ) {

      this.urlEndPoint = `${this.funcionesService.setUrlBase()}`;
    }

  logout(): void {
    const username = this.authService.usuario.username;
    this.authService.logout();
    Swal.fire({
      type: 'info',
      title: '¡Informacion!',
      text: `Hasta pronto ${username}`,
      footer: 'Has cerrado sesión con éxito!',
      });
    this.router.navigate(['/login']);
  }
}
