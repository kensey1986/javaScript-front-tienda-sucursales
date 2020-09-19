import { ReporteService } from './../services/reporte.service';
import { UserService } from './../../users/services/user.service';
import { Reporte } from './../interfaces/reporte';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from './../../generales/services/loading.service';
import { FuncionesService } from './../../generales/services/funciones.service';
import { AuthService } from './../../users/services/auth.service';
import { ProductoService } from './../../productos/services/producto.service';
import { Producto } from './../../productos/interfaces/producto';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-form-reportes',
  templateUrl: './form-reportes.component.html',
})
export class FormReportesComponent implements OnInit {
  titulo: string;
  reporte: Reporte = new Reporte();
  errores: string[];
  reportesLocales: string[] = ['Daño', 'Prestamo', 'Perdida', 'Otro'];
  idLocal = '';
  cantidadLocal = 0;

  constructor(
    public productoService: ProductoService,
    public userService: UserService,
    public reporteService: ReporteService,
    public authService: AuthService,
    public funcionesService: FuncionesService,
    public loadingService: LoadingService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.titulo = `${this.funcionesService.setTitulo()} -  Reportes -`;
    this.comprobacion();
  }

  comprobacion() {
    this.idLocal = sessionStorage.getItem('idpro');
    if (this.idLocal === null || this.idLocal === '' || this.idLocal === undefined) {
      this.activatedRoute.paramMap.subscribe((params) => {
        const reporteId = +params.get('reporteId');
        this.reporteService
          .getReporte(reporteId)
          .subscribe((reporte) => (this.reporte = reporte, this.cantidadLocal = reporte.cantidad));
        this.userService
          .getUser(JSON.parse(sessionStorage.getItem('usuario')).id)
          .subscribe((usuario) => {
            (this.reporte.usuario = usuario), this.loadingService.cerrarModal();
          });
      });
    } else {
      this.productoService
          .getProducto(this.idLocal)
          .subscribe((producto) => (this.reporte.producto = producto));
      this.userService
          .getUser(JSON.parse(sessionStorage.getItem('usuario')).id)
          .subscribe((usuario) => {
            (this.reporte.usuario = usuario), this.loadingService.cerrarModal();
          });
    }
  }

  create(reporteForm): void {
    sessionStorage.removeItem('idpro');
    if (this.reporte.cantidad === 0 ||  this.reporte.cantidad === null || this.reporte.cantidad === undefined) {
      Swal.fire({
        type: 'error',
        title: 'Ooops',
        text: `La cantidad de retiro no puede ser vacia`,
        footer: 'Intente de nuevo',
        });
      return;
    }
    if (this.reporte.descripcion === '' ||  this.reporte.descripcion === null || this.reporte.descripcion === undefined) {
      Swal.fire({
        type: 'error',
        title: 'Ooops',
        text: `Debe agregar una descipcion`,
        footer: 'Intente de nuevo',
        });
      return;
    }
    if (this.reporte.nombre === '' ||  this.reporte.nombre === null || this.reporte.nombre === undefined) {
      Swal.fire({
        type: 'error',
        title: 'Ooops',
        text: `Debe agregar tipo de Reporte`,
        footer: 'Intente de nuevo',
        });
      return;
    }
    if (this.reporte.producto.cantidad < this.reporte.cantidad) {
      Swal.fire({
        type: 'error',
        title: 'Ooops',
        text: `Cantidad de retiro`,
        footer: 'mayor al Stock',
        });
      return;
    }
    if (this.reporte.cantidad < 0) {
      Swal.fire({
        type: 'error',
        title: 'Ooops',
        text: `No ingresar Valores`,
        footer: 'negativos',
        });
      this.reporte.cantidad = 0;
      return;
    }
    if (reporteForm.form.valid ) {
      this.loadingService.abrirModal();
      this.reporteService.create(this.reporte).subscribe(reporte => {
        this.reporte.producto.cantidad = this.reporte.producto.cantidad - this.reporte.cantidad;
        this.productoService.update(this.reporte.producto)
        .subscribe(
          producto => {
            Swal.fire({
              type: 'success',
              title: `Reporte Generado Exitosamente:`,
              text: `Creado!`,
              footer: ``
            });
            this.loadingService.cerrarModal();
            // this.router.navigate(['/reportes', reporte.id]);
            this.router.navigate(['/reportes']);
          },
          err => {
            this.errores = err.error.errors as string[];
            this.loadingService.cerrarModal();
          }
        );
      },
      err => {
        this.errores = err.error.errors as string[],
        this.loadingService.cerrarModal();
      });
    }
  }

  actualziar(reporteForm) {
    sessionStorage.removeItem('idpro');
    if ( this.reporte.cantidad === null || this.reporte.cantidad === undefined) {
      Swal.fire({
        type: 'error',
        title: 'Ooops',
        text: `La cantidad de retiro no puede ser vacia`,
        footer: 'Intente de nuevo',
        });
      return;
    }
    if (this.reporte.descripcion === '' ||  this.reporte.descripcion === null || this.reporte.descripcion === undefined) {
      Swal.fire({
        type: 'error',
        title: 'Ooops',
        text: `Debe agregar una descipcion`,
        footer: 'Intente de nuevo',
        });
      return;
    }
    if (this.reporte.nombre === '' ||  this.reporte.nombre === null || this.reporte.nombre === undefined) {
      Swal.fire({
        type: 'error',
        title: 'Ooops',
        text: `Debe agregar tipo de Reporte`,
        footer: 'Intente de nuevo',
        });
      return;
    }
    if (this.cantidadLocal < this.reporte.cantidad) {
      Swal.fire({
        type: 'error',
        title: 'Ooops',
        text: `No puede retirar mas productos`,
        footer: 'Genere un nuevo reporte para ello',
        });
      return;
    }
    if (this.reporte.cantidad < 0) {
      Swal.fire({
        type: 'error',
        title: 'Ooops',
        text: `No ingresar Valores`,
        footer: 'negativos',
        });
      this.reporte.cantidad = 0;
      return;
    }
    if (reporteForm.form.valid ) {
      this.loadingService.abrirModal();
      this.reporte.fechaModificado = new Date();
      this.reporteService.update(this.reporte).subscribe(reporte => {
        if ( this.cantidadLocal === this.reporte.cantidad) {
          this.reporte.producto.cantidad = this.reporte.producto.cantidad;
        } else if ( this.cantidadLocal < this.reporte.cantidad) {
          this.reporte.producto.cantidad = this.reporte.producto.cantidad - (this.reporte.cantidad - this.cantidadLocal);
        } else if ( this.cantidadLocal > this.reporte.cantidad) {
          this.reporte.producto.cantidad = this.reporte.producto.cantidad + (this.cantidadLocal - this.reporte.cantidad);
        }
        this.productoService.update(this.reporte.producto)
        .subscribe(
          producto => {
            Swal.fire({
              type: 'success',
              title: `Reporte modificado :`,
              text: `Exitosamente`,
              footer: ``
            });
            this.loadingService.cerrarModal();
            // this.router.navigate(['/reportes', reporte.id]);
            this.router.navigate(['/reportes']);
          },
          err => {
            this.errores = err.error.errors as string[];
            this.loadingService.cerrarModal();
          }
        );
      },
      err => {
        this.errores = err.error.errors as string[],
        this.loadingService.cerrarModal();
      });
    }

  }
compararRegion(o1: Reporte, o2: Reporte): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }

    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }
}
