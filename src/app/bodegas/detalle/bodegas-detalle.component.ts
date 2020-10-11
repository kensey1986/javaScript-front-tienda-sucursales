import { Bodega } from './../models/bodega';
import { LoadingService } from './../../generales/services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../users/services/auth.service';
import { FuncionesService } from './../../generales/services/funciones.service';
import { BodegaService } from './../service/bodega.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-bodegas-detalle',
  templateUrl: './bodegas-detalle.component.html'
})
export class BodegasDetalleComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['detalle',  'usuario', 'nombre', 'createAt', 'fechaModificado', 'editar'  ];
  dataSource = new MatTableDataSource();

  bodega: Bodega;
  titulo: string;
  subtitulo = 'Detalle Bodega';
  activar = true;

  constructor(
    public bodegaService: BodegaService,
    public funcionesService: FuncionesService,
    public authService: AuthService,
    public activatedRoute: ActivatedRoute,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.abrirModal();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarBodega();
  }

  cargarBodega() {
    this.titulo = this.funcionesService.setTitulo();
    this.activatedRoute.paramMap.subscribe(
      params => {
      const id = +params.get('id');
      this.bodegaService.getBodegas(id)
      .subscribe(
        bodega => {(this.bodega = bodega, console.log(bodega.reportes));
                   this.dataSource.data = this.bodega.reportes;
                   if (this.dataSource.data.length > 0 ) {
                    this.activar = false;
                    this.loadingService.cerrarModal();
                   }
        });
    });
    this.loadingService.cerrarModal();
  }

  // cargarListadoReportesCompleto() {
  //   this.reporteService.getListadoReportes()
  //   .subscribe(datosTabla => {(this.dataSource.data = datosTabla, console.log(datosTabla));
  //                             if (datosTabla.length > 0 ) {
  //                               this.activar = false;
  //                               this.loadingService.cerrarModal();
  //                           }});
  // }

  gananciaUnidad(precioCompra: number, precioVenta: number): string {
      const ganancia = precioVenta - precioCompra;
      return this.formatNumber(ganancia);
  }

  inversionTotal(precioCompra: number, cantidad: number): string {
    const inversion = cantidad * precioCompra;
    return this.formatNumber(inversion);
}


gananciaTotal(precioCompra: number, precioVenta: number, cantidad: number): string {
  const ganancia = (precioVenta - precioCompra) *  cantidad;
  return this.formatNumber(ganancia);
}

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
 }
 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

}
