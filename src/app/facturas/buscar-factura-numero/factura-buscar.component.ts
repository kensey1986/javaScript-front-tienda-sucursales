import { Component } from '@angular/core';
import { ModalFacturaBuscarService } from '../services/modal-factura-buscar.service';
import { Factura } from '../interfaces/factura';
import { FacturaService } from '../services/factura.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { AuthService } from '../../users/services/auth.service';
import Swal from 'sweetalert2';
import { LoadingService } from '../../generales/services/loading.service';

@Component({
  selector: 'app-factura-buscar',
  templateUrl: 'factura-buscar.component.html',
  styleUrls: ['../../generales/css/modal.css']
})

export class FacturaBuscarComponent  {
  id: number;
  factura: Factura;
  titulo = 'Buscar Factura';
  public  urlEndPoint: string;

  constructor(
    public modalFacturaBuscarService: ModalFacturaBuscarService,
    public funcionesService: FuncionesService,
    public facturaService: FacturaService,
    public authService: AuthService,
    public loadingService: LoadingService,
  ) { this.urlEndPoint = `${this.funcionesService.setUrlBase()}`; }

  cerrarModalBusquedaFactura() {
    this.modalFacturaBuscarService.cerrarModal();
    this.factura = null;
  }

  buscarFactura() {
    this.loadingService.abrirModal();
    if ( this.id === null || this.id === undefined) {
      this.loadingService.cerrarModal();
      Swal.fire({
        type: 'error',
        title: 'Error al ingresar Numero de factura',
        text: 'Solo *Numeros* en este campo',
        footer: 'Favor ingresar un numero de factura valido',
        });
    } else {
      this.facturaService.getFactura(this.id).subscribe(
        factura => {this.factura = factura,
          this.loadingService.cerrarModal();
        });
    }
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }

}

