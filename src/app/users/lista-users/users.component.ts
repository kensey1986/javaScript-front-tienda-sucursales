import { FuncionesService } from './../../generales/services/funciones.service';
import { Sucursal } from './../../sucursales/interfaces/sucursal';
import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalUserService  } from '../services/modal-user.service';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../../generales/services/loading.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit {
  users: User[];
  paginador: any;
  userSelecionado: User;
  tipoUsuario: string;
  link = '/users/page';
  titulo: string;
  public  urlEndPoint: string;

  constructor(
    public  userService: UserService,
    public modalUserService: ModalUserService,
    public  activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public loadingService: LoadingService,
    public funcionesService: FuncionesService,
    ) { this.urlEndPoint = `${this.funcionesService.setUrlBase()}`;  }

  ngOnInit() {
    this.titulo = this.funcionesService.setTitulo();
    this.loadingService.abrirModal();
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.userService.getUsers(page)
    .pipe(
      tap( response => {
        // console.log('UsersComponent: tap 3');
        (response.content as User[]).forEach(user => {
          this.loadingService.cerrarModal();
        //  console.log(user.roles.length);
        });
      })
    ).subscribe(response => {
      this.users = response.content as User[];
      this.paginador = response;
    });
  });

    this.modalUserService.notificarUpload.subscribe(user => {
      this.users = this.users.map( userOriginal => {
        if (user.id === userOriginal.id) {
          userOriginal.foto = user.foto;
        }
        return userOriginal;
      });
    });
    setTimeout( () => {
      this.loadingService.cerrarModal();
    }, 3000);
  }

  delete(user: User): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar Al Usuario ${user.nombre} ${user.apellido} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Usuario!'
    }).then((result) => {
      if (result.value) {
          this.userService.delete(user.id).subscribe(
            response => {
              this.users = this.users.filter(cli => cli !== user);
              Swal.fire(
                'Borrado!',
                `Usuario ${user.nombre} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
    });
  }

  abrirModal(user: User) {
    this.userSelecionado = user;
    this.modalUserService.abrirModal();
  }

  tipoUsuarios(num: number): string {
    if (num === 1) {
      this.tipoUsuario = 'USUARIO';
    } else {
      this.tipoUsuario = 'ADMINISTRADOR';
    }
    return this.tipoUsuario;
  }

}
