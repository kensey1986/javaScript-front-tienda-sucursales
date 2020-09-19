import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
import { ClienteService  } from '../services/cliente.service';
import { HttpEventType } from '@angular/common/http';
import { ModalClienteService  } from '../services/modal-cliente.service';
import { AuthService } from '../../users/services/auth.service';
import Swal from 'sweetalert2';
import { Factura } from '../../facturas/interfaces/factura';
import { FacturaService } from './../../facturas/services/factura.service';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../productos/services/producto.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';



@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html'
})
export class DetalleClienteComponent implements OnInit {

  public  urlEndPoint: string;
  @Input() cliente: Cliente;
  titulo = 'Detalle Cliente';
  public fotoSelecionada: File;
  progreso = 0;
  rutaFoto = 'Selecionar Foto';

  constructor(
    public  clienteService: ClienteService,
    public funcionesService: FuncionesService,
    public modalClienteService: ModalClienteService,
    public authService: AuthService,
    public facturaService: FacturaService,
    public  activatedRoute: ActivatedRoute,
    public loadingService: LoadingService
   ) { this.urlEndPoint = `${this.funcionesService.setUrlBase()}`; }

   ngOnInit() {
    this.loadingService.abrirModal();
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      this.clienteService.getCliente(id)
      .subscribe(
        cliente => {this.cliente = cliente,
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
    if (!this.fotoSelecionada) {
      this.rutaFoto = 'Selecionar Foto';
      Swal.fire({
        type: 'error',
        title: 'Error al Subir Imagen',
        text: `No ha selecionado una imagen`,
        footer: 'Intente de nuevo',
        });
    } else {
      this.clienteService.subirFoto(this.fotoSelecionada, this.cliente.id)
      .subscribe( event => {
        if (event.type === HttpEventType.UploadProgress) {
              this.progreso = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
            const response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalClienteService.notificarUpload.emit(this.cliente);
            this.rutaFoto = 'Selecionar Foto';
            this.fotoSelecionada = null;
            Swal.fire({
              type: 'success',
              title: 'La Foto se ha subido con Exito!',
              text: response.mensaje,
              footer: '',
              });
            // TODO PENDIENTE POR REPARAR
            this.progreso = 0;
        }
      });
    }
  }
  delete(factura: Factura): void {
    Swal.fire({
      title: '¿ Estas Seguro ?',
      text: `¿Seguro De Eliminar la Factura ${factura.descripcion} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar Factura!'
    }).then((result) => {
      if (result.value) {
          this.facturaService.delete(factura.id).subscribe(
            response => {
              this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura);
              Swal.fire(
                'Borrada!',
                `Factura ${factura.descripcion} eliminado con Exito.`,
                'success'
              );
            }
          );
      }
    });
  }
  cerrarModal() {
    this.modalClienteService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
  }
}
