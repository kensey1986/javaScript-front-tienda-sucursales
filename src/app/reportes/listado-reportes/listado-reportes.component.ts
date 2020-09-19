import { ReporteService } from './../services/reporte.service';
import { Component, OnInit } from '@angular/core';
import { Reporte } from '../interfaces/Reporte';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../users/services/auth.service';
import { ProductoService } from '../../productos/services/producto.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';


@Component({
  selector: 'app-listado-reportes',
  templateUrl: './listado-reportes.component.html',
})

export class ListadoReportesComponent implements OnInit {
  dato = ' prueba ';
  reportes: Reporte[];
  paginador: any;
  link = '/facturas/page';
  titulo: string;
  public  urlEndPoint: string;

  constructor(
    public  reporteService: ReporteService,
    public  productoService: ProductoService,
    public funcionesService: FuncionesService,
    public  activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public loadingService: LoadingService
  ) { this.urlEndPoint = `${this.funcionesService.setUrlBase()}`;  }

  ngOnInit() {
    this.loadingService.abrirModal();
    this.titulo = this.funcionesService.setTitulo();
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.reporteService.getReportes(page)
    .pipe(
      tap( response => {
        // console.log('FacturasComponent: tap 3');
        (response.content as Reporte[]).forEach(reporte => {
          this.loadingService.cerrarModal();
          // console.log(cliente.nombre);
        });
      })
    ).subscribe(response => {
      this.reportes = response.content as Reporte[];
      this.paginador = response;
      });
    });
    setTimeout( () => {
      this.loadingService.cerrarModal();
    }, 3000);
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }

  // abrirModal() {
  //   this.modalFacturaService.abrirModal();
  // }
  // abrirModalBuscarFactura() {
  //   this.modalFacturaBuscarService.abrirModal();
  // }

}
