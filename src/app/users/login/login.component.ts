import { UserService } from './../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  formularioCreado: FormGroup;
  usuario: User;
  public  urlEndPoint: string;
  public  rol = 'USUARIO';
  //sucursales: Sucursal[];
  titulo = 'Bienvenido';
  opcionSeleccionado  = '';
  hide = true;
  //tmpSucursal: Sucursal;

  constructor(
    public authService: AuthService,
    public  router: Router,
    public loadingService: LoadingService,
    public funcionesService: FuncionesService,
    public  sucursalService: SucursalService,
    public formBuilder: FormBuilder,
    public userService: UserService
  ) {
    this.usuario = new User();
    // this.sucursalService.getSucursalLista()
    // .subscribe(sucursales => (this.sucursales = sucursales));
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
    this.crearFormulario();
  }


  login(): void {
    this.usuario.username = this.formularioCreado.value.usuario,
    this.usuario.password = this.formularioCreado.value.password,
    //this.tmpSucursal = this.formularioCreado.value.sucursal;
    console.log();
    if (this.usuario.username === null || this.usuario.password === null
      || this.usuario.username === undefined || this.usuario.password === undefined ) {
        Swal.fire({
          type: 'error',
          title: 'Error al Ingresar',
          text: 'El Usuario y/o Password vacios',
          footer: 'Intente de nuevo',
          });
        return;
    // } else if ( this.tmpSucursal === null  || this.tmpSucursal === undefined ) {
    //   Swal.fire({
    //     type: 'error',
    //     title: 'Error al Ingresar',
    //     text: 'Debe Selecionar Sucursal',
    //     footer: 'Intente de nuevo',
    //     });
    //   return;
    // 
  }
    //sessionStorage.setItem('sucursal', JSON.stringify(this.tmpSucursal));
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
      // else {
      //   this.userService.getUser(usuario.id).subscribe(user => {
      //     if (this.tmpSucursal.nombre !== user.sucursal.nombre) {
      //       this.authService.logout();
      //       this.loadingService.cerrarModal();
      //       Swal.fire({
      //         type: 'error',
      //         title: 'Acceso Denegado',
      //         text: 'No tiene autorizacion para ingresar a esta sucursal',
      //         footer: 'Intente de nuevo',
      //         });
      //       this.authService.logout();
      //       this.router.navigate(['/login']);
      //     }
      //   });
      // }
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
          title: 'Error al Ingresar',
          text: 'El Usuario y/o el Password Incorrectos',
          footer: 'Intente de nuevo',
          });
      }
    });
  }

  crearFormulario() {
    this.formularioCreado = this.formBuilder.group({
      usuario: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])],
      password: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])],
      // sucursal: [null, Validators.compose([
      //   Validators.required,
      // ])],
    });
  }

}
