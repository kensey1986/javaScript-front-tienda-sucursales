import { Component, OnInit } from '@angular/core';
import { FacturaService } from './../services/factura.service';
import { Factura } from '../interfaces/factura';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../users/services/auth.service';
import { ModalFacturaService } from './../services/modalFactura.service';
import { ModalFacturaBuscarService } from './../services/modal-factura-buscar.service';
import { ProductoService } from '../../productos/services/producto.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';


@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.component.html'
})
export class ListaFacturasComponent implements OnInit {
  dato = ' prueba ';
  facturas: Factura[];
  facturaFecha: Factura[];
  paginador: any;
  link = '/facturas/page';
  titulo: string;
  public  urlEndPoint: string;

  constructor(
    public  facturaService: FacturaService,
    public  productoService: ProductoService,
    public modalFacturaService: ModalFacturaService,
    public modalFacturaBuscarService: ModalFacturaBuscarService,
    public funcionesService: FuncionesService,
    public  activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public loadingService: LoadingService
  ) {
    this.urlEndPoint = `${this.funcionesService.setUrlBase()}`;
  }

  ngOnInit() {
    this.loadingService.abrirModal();
    this.titulo = this.funcionesService.setTitulo();
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.facturaService.getFacturas(page)
    .pipe(
      tap( response => {
        // console.log('FacturasComponent: tap 3');
        (response.content as Factura[]).forEach(cliente => {
          this.loadingService.cerrarModal();
          // console.log(cliente.nombre);
        });
      })
    ).subscribe(response => {
      this.facturas = response.content as Factura[];
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

  abrirModal() {
    this.modalFacturaService.abrirModal();
  }
  abrirModalBuscarFactura() {
    this.modalFacturaBuscarService.abrirModal();
  }

}
