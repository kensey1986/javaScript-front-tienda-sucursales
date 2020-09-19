import { FuncionesService } from './../../generales/services/funciones.service';
import { Component, OnInit } from '@angular/core';
import { Region } from '../interfaces/region';
import { RegionService } from '../services/region.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalRegionService  } from '../services/modal-region.service';
import { AuthService } from '../../users/services/auth.service';
import { LoadingService } from '../../generales/services/loading.service';


@Component({
  selector: 'app-regiones',
  templateUrl: './regiones.component.html'
})

export class RegionesComponent implements OnInit {

  regiones: Region[];
  paginador: any;
  regionSelecionado: Region;
  link = '/regiones/page';
  titulo: string;

  constructor(
    public  regionService: RegionService,
    public modalRegionService: ModalRegionService,
    public  activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public loadingService: LoadingService,
    public funcionesService: FuncionesService
    ) {
    }

  ngOnInit() {
    this.loadingService.abrirModal();
    this.titulo = this.funcionesService.setTitulo();
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.regionService.getRegiones(page)
    .pipe(
      tap( response => {
        // console.log('RegionesComponent: tap 3');
        (response.content as Region[]).forEach(region => {
          this.loadingService.cerrarModal();
        //  console.log(region.nombre);
        });
      })
    ).subscribe(response => {
      this.regiones = response.content as Region[];
      this.paginador = response;
      });
    });
    setTimeout( () => {
      this.loadingService.cerrarModal();
    }, 3000);
  }

  delete(region: Region): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar el Barrio ${region.nombre} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Barrio!'
    }).then((result) => {
      if (result.value) {
          this.regionService.delete(region.id).subscribe(
            response => {
              this.regiones = this.regiones.filter(reg => reg !== region);
              Swal.fire(
                'Borrado!',
                `Barrio ${region.nombre} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
    });
  }

  abrirModal(region: Region) {
    this.regionSelecionado = region;
    this.modalRegionService.abrirModal();
  }

}

