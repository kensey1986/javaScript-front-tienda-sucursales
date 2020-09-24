import { FuncionesService } from './../../generales/services/funciones.service';
import { Sucursal } from './../../sucursales/interfaces/sucursal';
import { Component, ViewChild, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ModalUserService  } from '../services/modal-user.service';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../../generales/services/loading.service';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'documento', 'nombre', 'apellido', 'username', 'rol', 'enabled', 'editar'];
  dataSource = new MatTableDataSource();
  activar = true;

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
    this.loadingService.abrirModal();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarListadoUsuariosCompleto();
    this.titulo = this.funcionesService.setTitulo();
    setTimeout( () => {
      this.loadingService.cerrarModal();
    }, 3000);
  }

  cargarListadoUsuariosCompleto() {
    this.userService.getListadoUsuarios()
    .subscribe(datosTabla => {this.dataSource.data = datosTabla; console.log(datosTabla);
                              if (datosTabla.length > 0 ) {
                                this.activar = false;
                                this.loadingService.cerrarModal();
                            }});
  }


  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    if ( filterValue === 'act' || filterValue === 'acti' || filterValue === 'activ' || filterValue === 'activo') {
        filterValue = 'true';
    }
    if ( filterValue === 'des' ||
        filterValue === 'desa' || filterValue === 'desac' ||
        filterValue === 'desact' || filterValue === 'desacti' ||
        filterValue === 'desactiv' || filterValue === 'desactivo' ||
        filterValue === 'desactiva' || filterValue === 'desactivad' ||
        filterValue === 'desactivado' ) {
      filterValue = 'false';
  }
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
