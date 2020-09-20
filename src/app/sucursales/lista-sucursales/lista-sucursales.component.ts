import { FuncionesService } from './../../generales/services/funciones.service';
import { Component, OnInit } from '@angular/core';
import { Sucursal } from '../interfaces/sucursal';
import { SucursalService } from '../services/sucursal.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalSucursalService  } from '../services/modal-sucursal.service';
import { AuthService } from '../../users/services/auth.service';
import { LoadingService } from '../../generales/services/loading.service';


@Component({
  selector: 'app-lista-sucursales',
  templateUrl: './lista-sucursales.component.html'
})
export class ListaSucursalesComponent implements OnInit {

  sucursales: Sucursal[];
  paginador: any;
  sucursalSelecionado: Sucursal;
  link = '/sucursales/page';
  titulo: string;

  constructor(
    public sucursalService: SucursalService,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public loadingService: LoadingService,
    public funcionesService: FuncionesService,
    ) {
    }

  ngOnInit() {
    this.titulo = this.funcionesService.setTitulo();
    this.loadingService.abrirModal();
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.sucursalService.getSucursales(page)
    .pipe(
      tap( response => {
        // console.log('RegionesComponent: tap 3');
        (response.content as Sucursal[]).forEach(sucursal => {
          this.loadingService.cerrarModal();
        //  console.log(region.nombre);
        });
      })
    ).subscribe(response => {
      this.sucursales = response.content as Sucursal[];
      this.paginador = response;
      });
    });
    setTimeout( () => {
      this.loadingService.cerrarModal();
    }, 3000);
  }

  delete(sucursal: Sucursal): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar la Sucursal ${sucursal.nombre} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Sucursal!'
    }).then((result) => {
      if (result.value) {
          this.sucursalService.delete(sucursal.id).subscribe(
            response => {
              this.sucursales = this.sucursales.filter(reg => reg !== sucursal);
              Swal.fire(
                'Borrado!',
                `Barrio ${sucursal.nombre} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
    });
  }



}


