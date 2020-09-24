import {  Component, ViewChild, OnInit } from '@angular/core';
import { Producto } from '../interfaces/producto';
import { ProductoService } from '../services/producto.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalProductoService  } from '../services/modal-producto.service';
import { AuthService } from '../../users/services/auth.service';
import { ModalProductoBuscarService } from '../producto-buscar/modal-producto-buscar.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['id', 'codigo', 'nombre', 'precio', 'cantidad', 'createAt', 'fechaVenta' ];
  dataSource = new MatTableDataSource();

  activar = true;
  productos: Producto[];
  link = '/productos/page';
  paginador: any;
  titulo: string;
  public  urlEndPoint: string;

  constructor(
    public  productoService: ProductoService,
    public modalProductoService: ModalProductoService,
    public modalProductoBuscarService: ModalProductoBuscarService,
    public  activatedRoute: ActivatedRoute,
    public funcionesService: FuncionesService,
    public authService: AuthService,
    public loadingService: LoadingService
    ) { this.urlEndPoint = `${this.funcionesService.setUrlBase()}`; }

  ngOnInit() {
    this.cerrarModalBusquedaProducto();
    this.loadingService.abrirModal();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarListadoProductosCompleto();
    this.titulo = this.funcionesService.setTitulo();
    setTimeout( () => {
      this.loadingService.cerrarModal();
    }, 2500);
  }

  cargarListadoProductosCompleto() {
    this.productoService.getListadoProductos()
    .subscribe(datosTabla => {this.dataSource.data = datosTabla;
                              if (datosTabla.length > 0 ) {
                                    this.activar = false;
                                    this.loadingService.cerrarModal();
                                }});
  }

  delete(producto: Producto): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar El Producto ${producto.nombre} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Producto!'
    }).then((result) => {
      if (result.value) {
          this.productoService.delete(producto.id).subscribe(
            response => {
              this.productos = this.productos.filter(cli => cli !== producto);
              Swal.fire(
                'Borrado!',
                `Producto ${producto.nombre} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
    });
  }

  cargarProductosConPagina() {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
          page = 0;
      }
      this.productoService.getProductos(page)
    .pipe(
      tap( response => {
        // console.log('ProductoComponent: tap 3');
        (response.content as Producto[]).forEach(producto => {
          this.loadingService.cerrarModal();
        //  console.log(producto);
        });
      })
    ).subscribe(response => {
      this.productos = response.content as Producto[];
      this.paginador = response;
    });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirModalProductoBuscar() {
    this.modalProductoBuscarService.abrirModal();
  }

  cerrarModalBusquedaProducto() {
    this.modalProductoBuscarService.cerrarModal();
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }

}
