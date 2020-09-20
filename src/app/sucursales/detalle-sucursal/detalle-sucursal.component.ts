import { FuncionesService } from './../../generales/services/funciones.service';
import { AuthService } from './../../users/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FacturaService } from './../../facturas/services/factura.service';
import { LoadingService } from './../../generales/services/loading.service';

import { Component, Input, OnInit } from '@angular/core';
import { Sucursal } from '../interfaces/sucursal';
import { SucursalService  } from '../services/sucursal.service';

@Component({
  selector: 'app-detalle-sucursal',
  templateUrl: './detalle-sucursal.component.html',
  styleUrls: ['../../generales/css/modal.css']
})

export class DetalleSucursalComponent implements OnInit  {

  @Input() sucursal: Sucursal;
  titulo = 'Detalle Sucursal';

  constructor(
    public  sucursalService: SucursalService,
    public loadingService: LoadingService,
    public facturaService: FacturaService,
    public  activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public funcionesService: FuncionesService,
   ) { }

   ngOnInit() {
    this.loadingService.abrirModal();
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      this.sucursalService.getSucursal(id)
      .subscribe(
        sucursal => {this.sucursal = sucursal,
                    this.loadingService.cerrarModal();
        });
    });
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }

}
