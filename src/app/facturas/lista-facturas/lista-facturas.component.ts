import { Component, ViewChild, OnInit } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.component.html'
})
export class ListaFacturasComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id',  'numeroFactura', 'totalFactura', 'totalGanancia', 'createAt' ];
  dataSource = new MatTableDataSource();
  activar = true;

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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarListadoFacturasCompleto();
    setTimeout( () => {
      this.loadingService.cerrarModal();
    }, 3000);
  }

  cargarListadoFacturasCompleto() {
    this.facturaService.getListadoFacturas()
    .subscribe(datosTabla => {this.dataSource.data = datosTabla, console.log(datosTabla);
                              if (datosTabla.length > 0 ) {
                                this.activar = false;
                                this.loadingService.cerrarModal();
                            }});
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirModal() {
    this.modalFacturaService.abrirModal();
  }
  abrirModalBuscarFactura() {
    this.modalFacturaBuscarService.abrirModal();
  }

}
