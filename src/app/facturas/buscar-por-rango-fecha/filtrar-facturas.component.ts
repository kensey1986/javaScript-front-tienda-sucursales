import { Component } from '@angular/core';
import { FacturaService } from '../services/factura.service';
import { Factura } from '../interfaces/factura';
import { AuthService } from '../../users/services/auth.service';
import { ModalFacturaService } from '../services/modalFactura.service';
import { ModalFacturaBuscarService } from '../services/modal-factura-buscar.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import Swal from 'sweetalert2';
import { LoadingService } from '../../generales/services/loading.service';


@Component({
  selector: 'app-filtrar-facturas',
  templateUrl: './filtrar-facturas.component.html',
})

export class FiltrarFacturasComponent {

  public  urlEndPoint: string;
  titulo = 'Informes - Facturas';
  facturas: Factura[];
  fechaInicioFiltro: string;
  fechaFinFiltro: string;
  gananciaFiltro = 0;
  totalFiltro = 0;

  constructor(
    public  facturaService: FacturaService,
    public modalFacturaService: ModalFacturaService,
    public modalFacturaBuscarService: ModalFacturaBuscarService,
    public funcionesService: FuncionesService,
    public loadingService: LoadingService,
    public authService: AuthService
  ) {
    this.titulo = this.funcionesService.setTitulo();
    this.urlEndPoint = `${this.funcionesService.setUrlBase()}`;
  }

  filtrarFacturas() {
    this.gananciaFiltro = 0;
    this.totalFiltro = 0;
    if (this.fechaInicioFiltro !== undefined && this.fechaInicioFiltro != null) {
      if (this.fechaFinFiltro !== undefined && this.fechaFinFiltro != null) {
        if (this.fechaFinFiltro > this.fechaInicioFiltro) {
          this.loadingService.abrirModal();
          this.facturaService.getFiltrarFacturasPorFecha(this.fechaInicioFiltro, this.fechaFinFiltro)
          .subscribe(
            facturas => {this.facturas = facturas;
                         this.facturas.forEach(datos => {
                          this.gananciaFiltro += datos.totalGanancia;
                          this.totalFiltro += datos.totalFactura;
                          });
                         this.loadingService.cerrarModal();
            },
          );
        } else {
          Swal.fire({
            type: 'error',
            title: `Error al seleccionar la 'Fecha Final'`,
            text: 'Fecha Final Debe ser Mayor o igual a la Fecha Incial',
            footer: '',
            });
        }
      } else {
        Swal.fire({
          type: 'error',
          title: `No ha Selecionado una Fecha`,
          text: 'Selecionar Fecha Final, para realizar busqueda',
          footer: '',
          });
      }
    } else {
      Swal.fire({
        type: 'error',
        title: `No ha Selecionado una Fecha`,
        text: 'Selecionar Fecha Inicial, para realizar busqueda',
        footer: '',
        });
    }
  }


formatNumber(cantidad: number): string {
      return this.funcionesService.formatNumber(cantidad);
  }
}
