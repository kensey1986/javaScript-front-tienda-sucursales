import { FuncionesService } from './../../generales/services/funciones.service';
import {  Component, ViewChild, OnInit } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
import { ClienteService } from '../services/cliente.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalClienteService  } from '../services/modal-cliente.service';
import { AuthService } from '../../users/services/auth.service';
import { ModalFacturaService } from '../../facturas/services/modalFactura.service';
import { LoadingService } from '../../generales/services/loading.service';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})

export class ClientesComponent implements OnInit  {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'documento', 'nombre', 'apellido', 'editar', 'facturar'  ];
  dataSource = new MatTableDataSource();
  activar = true;


  public  urlEndPoint: string;
  clientes: Cliente[];
  link = '/clientes/page';
  paginador: any;
  titulo: string;

  constructor(
    public  clienteService: ClienteService,
    public modalClienteService: ModalClienteService,
    public modalFacturaService: ModalFacturaService,
    public  activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    public funcionesService: FuncionesService,
    public authService: AuthService) {
      this.urlEndPoint = `${this.funcionesService.setUrlBase()}`;
    }

  ngOnInit() {
    this.loadingService.abrirModal();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.titulo = this.funcionesService.setTitulo();
    this.cargarListadoClientesCompleto();
    setTimeout( () => {
      this.loadingService.cerrarModal();
    }, 2500);
  }

  cargarListadoClientesCompleto() {
    this.clienteService.getListadoClientes()
    .subscribe(datosTabla => {this.dataSource.data = datosTabla;
                              if (datosTabla.length > 0 ) {
                                this.activar = false;
                                this.loadingService.cerrarModal();
                            }});
  }

  cargarClientesPaginas( ) {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.clienteService.getClientes(page)
    .pipe(
      tap( response => {
        // console.log('ClientesComponent: tap 3');
        (response.content as Cliente[]).forEach(cliente => {
        //  console.log(cliente.nombre);
        this.loadingService.cerrarModal();
        });
      })
    ).subscribe(response => {
      this.clientes = response.content as Cliente[];
      this.paginador = response;
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar Al Cliente ${cliente.nombre} ${cliente.apellido} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Cliente!'
    }).then((result) => {
      if (result.value) {
          this.clienteService.delete(cliente.id).subscribe(
            response => {
              this.clientes = this.clientes.filter(cli => cli !== cliente);
              Swal.fire(
                'Borrado!',
                `Cliente ${cliente.nombre} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
    });
  }

  abrirModal() {
    this.modalFacturaService.abrirModal();
  }

}
