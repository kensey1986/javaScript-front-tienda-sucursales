import { SucursalService } from './../../sucursales/services/sucursal.service';
import { BodegaService } from './../../bodegas/service/bodega.service';
import { Bodega } from './../../bodegas/models/bodega';
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
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { FormControl, Validators,
  FormBuilder, FormGroup} from '@angular/forms';

import { Sucursal } from 'src/app/sucursales/interfaces/sucursal';



@Component({
  selector: 'app-form-reportes',
  templateUrl: './form-reportes.component.html',
})

export class FormReportesComponent implements OnInit {
  titulo: string;
  subtitulo = 'Crear Reporte';
  reporte: Reporte = new Reporte();
  errores: string[];
  tipoReporte: string[] = ['Daño', 'Perdida', 'Otro'];
  idLocal = '';
  bodega: Bodega;
  sucursales: Sucursal[];
  nombreProducto: string;
  productoBodega: Producto;
  sucursalTraslado: Sucursal;
  bodegaIncrementar: Bodega;
  bodegaSucursalNombre: string;
  preCantidad = 0;
  actualizando = false;
  opcionSelecionada = 'Reportes';
  opciones: string[] = ['Reportes', 'Traslados'];
  productosFiltrados: Observable<Producto[]>;
  autocompleteControl = new FormControl();
  producto = new Producto();
  codigo: string;
  idCompuesto: string;
  cantidadModificada: number;

  formularioReporte: FormGroup;
  formularioTraslado: FormGroup;

  constructor(
    public productoService: ProductoService,
    public userService: UserService,
    public reporteService: ReporteService,
    public authService: AuthService,
    public funcionesService: FuncionesService,
    public loadingService: LoadingService,
    public router: Router,
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public bodegaService: BodegaService,
    public sucursalService: SucursalService,
  ) {}

  ngOnInit() {
    this.loadingService.abrirModal();
    this.cargarBodega();
    this.cargarUsuario();
    this.titulo = `${this.funcionesService.setTitulo()} `;
  }

  cargarUsuario() {
    this.userService
          .getUser(JSON.parse(sessionStorage.getItem('usuario')).id)
          .subscribe((usuario) => {
            (this.reporte.usuario = usuario), this.loadingService.cerrarModal();
          });
  }
  cargarBodega() {
    this.activatedRoute.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.bodegaService.getBodegas(id)
        .subscribe(
          bodega => {(this.bodega = bodega, this.preCantidad  = bodega.cantidad,
                    this.reporte.bodega = bodega, this.productoBodega = bodega.producto,
                    this.bodegaSucursalNombre = bodega.sucursal.nombre), this.crearFormulario();
                     this.cargarListaSucursal();
                     this.loadingService.cerrarModal();
          });
    });
  }

  cargarListaSucursal() {
    this.sucursalService.getSucursalLista()
    .subscribe(sucursales => (
      this.sucursales = sucursales.filter(
        sucursal => sucursal.nombre !== this.bodegaSucursalNombre)));
  }



  create() {
    if (this.opcionSelecionada === 'Reportes') {
      if (this.asignarDatosParaGuardarRerporte()) {
        this.loadingService.abrirModal();
        this.bodegaService.update(this.bodega)
        .subscribe( () => {
          this.reporteService.create(this.reporte)
          .subscribe( reporte  => {
            Swal.fire({
              type: 'success',
              title: `Creado Exitosamente!`,
              text: `Reporte tipo "${reporte.nombre}"`,
              footer: `La Bodega Tambien se Actualizo`
            });
            this.loadingService.cerrarModal();
            // this.router.navigate(['/reportes', reporte.id]);
            this.router.navigate(['/reportes/details/']);
          },
          err => {
            this.errores = err.error.errors as string[];
            this.loadingService.cerrarModal();
          });
        },
        err => {
          this.errores = err.error.errors as string[];
          this.loadingService.cerrarModal();
        });
      } else {
        console.error('Ha ocurrido algun error al crear reporte');
      }
    } else {
       if (this.asignarDatosParaGuardarTraslado()) {
          this.loadingService.abrirModal();
          this.bodegaService.getVerificarBodegas(this.idCompuesto)
          .subscribe( bodega => {this.bodegaIncrementar = bodega; console.log(bodega);
                                 if (bodega !== null ) {
                                  this.bodegaIncrementar.precioCompra = this.calcularPreciCompra();
                                  this.bodegaIncrementar.cantidad = this.bodegaIncrementar.cantidad + this.cantidadModificada;
                                  this.bodegaService.update(this.bodega)
                                  .subscribe( () => {
                                    this.bodegaService.update(this.bodegaIncrementar)
                                    .subscribe( () => {
                                      this.reporteService.create(this.reporte)
                                      .subscribe( reporte  => {
                                        console.log(this.bodegaIncrementar);
                                        Swal.fire({
                                          type: 'success',
                                          title: `Traslado ${this.cantidadModificada} "${this.bodega.producto.nombre}"`,
                                          text: `Desde: "${this.bodega.nombre}" hacia: "${this.bodegaIncrementar.nombre}`,
                                          footer: `La Bodega Tambien se Actualizo`
                                        });
                                        this.loadingService.cerrarModal();
                                        // this.router.navigate(['/reportes', reporte.id]);
                                        this.router.navigate(['/reportes/details/', reporte.id]);
                                      },
                                      err => {
                                        this.errores = err.error.errors as string[];
                                        this.loadingService.cerrarModal();
                                      });
                                    });
                                  },
                                  err => {
                                    this.errores = err.error.errors as string[];
                                    this.loadingService.cerrarModal();
                                  });
            } else {
              console.log('ingreso a negarlo');
              Swal.fire({
                type: 'error',
                title: `Accion No Permitida!`,
                // tslint:disable-next-line: max-line-length
                text: `No Existe Bodega en la Sede "${this.sucursalTraslado.nombre}"  para el Producto "${this.productoBodega.nombre}"`,
                footer: 'Intente de Nuevo',
                });
              this.loadingService.cerrarModal();
            }
          },
          err => {
            this.errores = err.error.errors as string[];
            this.loadingService.cerrarModal();
          });
       } else {
          console.error('Ha ocurrido algun error al crear reporte');
       }
    }
  }
  update() {
  }

  crearFormulario() {
    this.formularioReporte = this.formBuilder.group({
      tipoReporte: ['', Validators.compose([
        Validators.required,
      ])],
      cantidadReporte: [1, Validators.compose([
        Validators.required, Validators.min(0),
        Validators.max(this.preCantidad + 1)
      ])],
      descripcion: ['', Validators.compose([
        Validators.required, Validators.minLength(10),
        Validators.maxLength(100)
      ])],
    });

    this.formularioTraslado = this.formBuilder.group({
      cantidadTraslado: [1, Validators.compose([
        Validators.required, Validators.min(0),
        Validators.max(this.preCantidad + 1)
      ])],
      descripcionTraslado: ['', Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(100)
      ])],
      sucursal: ['', Validators.compose([
        Validators.required,
      ])],
    });
  }


  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
 }

 redondearPrecioCompra(precioCompra: number): number  {
  const precio = parseFloat(precioCompra.toFixed(2));
  return precio;
}

 validarPositivos(campo: string, event: any): number {
  const cantidad: number = event.target.value as number;
  if (this.actualizando === false ) {
    if (cantidad < 0) {
      Swal.fire({
        type: 'error',
        title: `${cantidad}`,
        text: `Es un valor no valido para "${campo}"`,
        footer: 'Intente de nuevo',
        });
      return event.target.value = 0;
    } else if (cantidad > this.preCantidad) {
      Swal.fire({
        type: 'error',
        title: `Accion No Permitida!`,
        text: `Cantidad en el stock "${this.preCantidad}", No puede retirar o trasladar mas. `,
        footer: 'Intente de Nuevo',
        });
      return event.target.value = this.preCantidad;
    }
  } else {
    if (cantidad > this.preCantidad) {
      Swal.fire({
        type: 'error',
        title: `Accion No Permitida!`,
        text: `Cantidad en el stock "${this.preCantidad}", No puede retirar o trasnladar mas. `,
        footer: 'Intente de Nuevo',
        });
      return event.target.value = this.preCantidad;
    }
  }

}

asignarDatosParaGuardarRerporte(): boolean {
  this.cantidadModificada = this.formularioReporte.value.cantidadReporte;
  if ( this.cantidadModificada <= 0 ) {
    Swal.fire({
      type: 'error',
      title: `Accion No Permitida!`,
      text: `No puede generar un reporte de  "${this.cantidadModificada}" Productos`,
      footer: 'Intente de Nuevo',
      });
    return false;
  }
  const nuevaCantidadBodega = this.preCantidad - this.cantidadModificada;
  this.bodega.cantidad = nuevaCantidadBodega;
  this.reporte.nombre = this.formularioReporte.value.tipoReporte;
  this.reporte.cantidad = this.cantidadModificada;
  this.reporte.precioCompra = this.bodega.precioCompra;
  this.reporte.descripcion = this.formularioReporte.value.descripcion;
  return true;
}

asignarDatosParaGuardarTraslado(): boolean {
  this.cantidadModificada = this.formularioTraslado.value.cantidadTraslado;
  if ( this.cantidadModificada <= 0 ) {
    Swal.fire({
      type: 'error',
      title: `Accion No Permitida!`,
      text: `No puede generar un traslado de  "${this.cantidadModificada}" Productos`,
      footer: 'Intente de Nuevo',
      });
    return false;
  }
  const nuevaCantidadBodega = this.preCantidad - this.cantidadModificada;
  this.bodega.cantidad = nuevaCantidadBodega;
  this.reporte.nombre = 'Traslado';
  this.reporte.cantidad = this.cantidadModificada;
  this.reporte.precioCompra = this.bodega.precioCompra;
  this.sucursalTraslado = this.formularioTraslado.value.sucursal;
  this.reporte.descripcion = this.formularioTraslado.value.descripcionTraslado;
  this.idCompuesto = (this.sucursalTraslado.id.toString() + this.productoBodega.id.toString());

  return true;
}

calcularPreciCompra(): number {
   const inversionSaliente = this.bodega.precioCompra * this.cantidadModificada;
   console.log('inversion saliente');
   console.log(inversionSaliente);
   const inversionAumenta = this.bodegaIncrementar.precioCompra * this.bodegaIncrementar.cantidad;
   console.log('inversion aumenta');
   console.log(inversionAumenta);
   const nuevoPrecioCompra = (inversionSaliente + inversionAumenta) / (this.cantidadModificada + this.bodegaIncrementar.cantidad);
   console.log('Nuevo precio compra');
   console.log(nuevoPrecioCompra);
   return this.redondearPrecioCompra(nuevoPrecioCompra);
}

}
