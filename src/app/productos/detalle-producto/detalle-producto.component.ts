import { LoadingService } from './../../generales/services/loading.service';
import { Component, OnInit, Input } from '@angular/core';
import { Producto } from '../interfaces/producto';
import { ProductoService  } from '../services/producto.service';
import { ModalProductoService  } from '../services/modal-producto.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../users/services/auth.service';
import { ModalProductoBuscarService } from '../producto-buscar/modal-producto-buscar.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['../../generales/css/modal.css']
})
export class DetalleProductoComponent implements OnInit {

  @Input() producto: Producto;
  titulo = 'Detalle Producto';
  public fotoSelecionada: File;
  progreso = 0;
  rutaFoto = 'Selecionar Foto';
  public  urlEndPoint: string;

  constructor(
    public  productoService: ProductoService,
    public modalProductoService: ModalProductoService,
    public modalProductoBuscarService: ModalProductoBuscarService,
    public funcionesService: FuncionesService,
    public  activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public loadingService: LoadingService
   ) { this.urlEndPoint = `${this.funcionesService.setUrlBase()}`; }

   ngOnInit() {
    this.loadingService.cerrarModal();
    this.modalProductoBuscarService.cerrarModal();
    this.loadingService.abrirModal();
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      this.productoService.getProducto(id)
      .subscribe(
        producto => {this.producto = producto,
                     this.loadingService.cerrarModal();
        });
    });
  }

  seleccionarFoto(event) {
    this.fotoSelecionada = event.target.files[0];
    this.progreso = 0;
    if (this.fotoSelecionada.type.indexOf('image') < 0) {
      Swal.fire({
        type: 'error',
        title: 'Error al Subir Selecionar Imagen',
        text: `El archivo debe ser del tipo 'Imagen'`,
        footer: 'Intente de nuevo',
        });
      this.fotoSelecionada = null;
    } else {
      this.rutaFoto = this.fotoSelecionada.name;
    }
  }

  subirFoto() {
    console.log('ingreso a subir foto');
    if (!this.fotoSelecionada) {
      this.rutaFoto = 'Selecionar Foto';
      Swal.fire({
        type: 'error',
        title: 'Error al Subir Imagen',
        text: `No ha selecionado una imagen`,
        footer: 'Intente de nuevo',
        });
    } else {
    this.productoService.subirFoto(this.fotoSelecionada, this.producto.id)
    .subscribe( event => {
      if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
          const response: any = event.body;
          this.producto = response.producto as Producto;
          this.modalProductoService.notificarUpload.emit(this.producto);
          this.rutaFoto = 'Selecionar Foto';
          this.fotoSelecionada = null;
          Swal.fire({
            type: 'success',
            title: 'La Foto se ha subido con Exito!',
            text: response.mensaje,
            footer: '',
            });
          // pendiente meter un time out
          this.progreso = 0;
      }
    });
  }
  }
  cerrarModal() {
    this.modalProductoService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
    this.modalProductoBuscarService.cerrarModal();
    this.producto = null;
  }
  calcularInversion(cantidad: number, precioCompra: number): string {
    const inversion =  (cantidad * precioCompra);
    const inversionFormat = inversion.toFixed(2);
    return this.formatNumber(parseFloat(inversionFormat));
  }

  redondearPrecioCompra(precioCompra: number): string  {
    const precio = precioCompra.toFixed(2);
    return this.formatNumber(parseFloat(precio));
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }
  enviarProducto(id: number) {
    sessionStorage.setItem('idpro', id.toString());
  }

}
