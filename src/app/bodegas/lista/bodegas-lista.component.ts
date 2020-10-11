import { Bodega } from './../models/bodega';
import { BodegaService } from './../service/bodega.service';
import { Component, ViewChild, OnInit } from '@angular/core';
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
  selector: 'app-bodegas-lista',
  templateUrl: './bodegas-lista.component.html'
})

export class BodegasListaComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id',  'cantidad', 'producto', 'nombre', 'precioCompra', 'precioVenta', 'createAt', 'editar'  ];
  dataSource = new MatTableDataSource();
  activar = true;


  bodegas: Bodega[];
  paginador: any;
  link = '/facturas/page';
  titulo: string;
  public  urlEndPoint: string;

  constructor(
    public  bodegaService: BodegaService,
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
    this.cargarListadoBodegasCompleto();
    this.titulo = this.funcionesService.setTitulo();
    setTimeout( () => {
      this.loadingService.cerrarModal();
    }, 3000);
  }

  cargarListadoBodegasCompleto() {
    this.bodegaService.getListadoBodegas()
    .subscribe(datosTabla => {(this.dataSource.data = datosTabla, console.log(datosTabla));
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
      this.bodegaService.getBodega(page)
    .pipe(
      tap( response => {
        // console.log('FacturasComponent: tap 3');
        (response.content as Bodega[]).forEach(() => {
          this.loadingService.cerrarModal();
          // console.log(cliente.nombre);
        });
      })
    ).subscribe(response => {
      this.bodegas = response.content as Bodega[];
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
