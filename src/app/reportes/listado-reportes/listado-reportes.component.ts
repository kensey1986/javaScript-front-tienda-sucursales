import { ReporteService } from './../services/reporte.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Reporte } from '../interfaces/Reporte';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../users/services/auth.service';
import { ProductoService } from '../../productos/services/producto.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-listado-reportes',
  templateUrl: './listado-reportes.component.html',
})

export class ListadoReportesComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['detalle',  'producto.nombre', 'id', 'nombre', 'createAt', 'fechaModificado', 'editar'  ];
  dataSource = new MatTableDataSource();
  activar = true;


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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarListadoReportesCompleto();
    this.titulo = this.funcionesService.setTitulo();
    setTimeout( () => {
      this.loadingService.cerrarModal();
    }, 3000);
  }

  cargarListadoReportesCompleto() {
    this.reporteService.getListadoReportes()
    .subscribe(datosTabla => {this.dataSource.data = datosTabla;
                              if (datosTabla.length > 0 ) {
                                this.activar = false;
                                this.loadingService.cerrarModal();
                            }});
  }

  cargarListadoReportesPagina() {
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }


}
