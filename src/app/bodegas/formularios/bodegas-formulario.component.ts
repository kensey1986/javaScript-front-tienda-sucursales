import { FuncionesService } from './../../generales/services/funciones.service';
import { Producto } from './../../productos/interfaces/producto';
import { ProductoService } from './../../productos/services/producto.service';
import { Sucursal } from './../../sucursales/interfaces/sucursal';
import { SucursalService } from './../../sucursales/services/sucursal.service';
import { BodegaService } from './../service/bodega.service';
import { Bodega } from './../models/bodega';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl,
         FormGroupDirective,
         NgForm, Validators,
         FormBuilder, FormGroup} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import Swal from 'sweetalert2';
import { LoadingService } from '../../generales/services/loading.service';
import { map,  flatMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-bodegas-formulario',
  templateUrl: './bodegas-formulario.component.html'
})


export class BodegasFormularioComponent implements OnInit {

  formularioCreado: FormGroup;
  minDate = new Date(1930, 1, 1);
  maxDate = new Date();
  bodega: Bodega = new Bodega();
  sucursales: Sucursal[];
  titulo = 'Crear Bodega';
  errores: string[];
  codigo: string;
  nombreProducto: string;
  nombreSucursal: string;
  producto = new Producto();
  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;
  preCantidad: number;
  prePcompra: number;
  prePventa: number;
  actualizando = false;

  constructor(
              public bodegaService: BodegaService,
              public productoService: ProductoService,
              public router: Router,
              public sucursalService: SucursalService,
              public activatedRoute: ActivatedRoute,
              public loadingService: LoadingService,
              public formBuilder: FormBuilder,
              public funcionesService: FuncionesService
              ) { }

  ngOnInit() {
    this.loadingService.abrirModal();
    this.crearFormulario();
    this.cargarBodega();
    this.cargarListaSucursal();
    this.filtrarProductos();
  }

   // metodos del select autocomplete inicio
  filtrarProductos() {
    this.productosFiltrados = this.autocompleteControl.valueChanges
    .pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
      flatMap(value => value ? this._filter(value) : [])
    );
  }
  public  _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toUpperCase();
    return this.productoService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    const producto = event.option.value as Producto;
    this.codigo = producto.codigo;
    this.nombreProducto = producto.nombre;
    this.producto = producto;

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }


  // metodos del select autocomplete fin

  cargarListaSucursal() {
    this.sucursalService.getSucursalLista()
    .subscribe(sucursales => (this.sucursales = sucursales));

  }

  cargarBodega(): void {
    this.loadingService.abrirModal();
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
            this.bodegaService.getBodegas(id).subscribe(
            (bodega) => {(this.bodega = bodega, this.actualizando = true);
                         this.asignarDatosFormulario();
            });
        }
      });
    // this.regionService.getRegionLista().subscribe(regiones => this.regiones = regiones);
    this.loadingService.cerrarModal();
  }

  public create(): void {
    this.loadingService.abrirModal();
    if (this.validarDatos() === true) {
      this.asignarDatosParaGuardar();
      if (this.asignarDatosParaGuardar()) {
        this.bodegaService.createBodega(this.bodega).subscribe(
          bodega => {
             this.router.navigate(['/bodegas/details', bodega.id]),
             Swal.fire({
               type: 'success',
               title: `Bodega Creada`,
               text: `Producto "${this.bodega.producto.nombre}", Asignado a la Sucursal "${this.bodega.sucursal.nombre}" `,
               footer: 'Con Exito!',
               });
             this.loadingService.cerrarModal();
           },
           err => {
             this.errores = err.error.errors as string[];
             this.loadingService.cerrarModal();
             console.error(err);
           }
         );
      }
    }
    this.loadingService.cerrarModal();
  }

  update(): void {
    this.loadingService.abrirModal();
    if (this.validarDatos()) {
    this.asignarDatosParaGuardar();
    if (this.asignarDatosParaGuardar()) {
      this.validarDatosParaActualizar();
      this.bodegaService.update(this.bodega)
      .subscribe(
        bodega => {
          this.router.navigate(['/bodegas/details', bodega.id]),
          Swal.fire({
            type: 'success',
            title: `Bodega Actualizada`,
            text: `Bodega con Producto "${this.bodega.producto.nombre}" y Sucursal "${this.bodega.sucursal.nombre}" `,
            footer: `Actualizada con Exito!`,
            });
          this.loadingService.cerrarModal();
        },
        err => {
          this.errores = err.error.errors as string[];
          this.loadingService.cerrarModal();
          console.error(err);
        }
    );
    }
  }
    this.loadingService.cerrarModal();
  }


  // tratamiento a formulario
  crearFormulario() {
    this.formularioCreado = this.formBuilder.group({
      cantidad: [1, Validators.compose([
        Validators.required, Validators.min(0)
      ])],
      sucursal: ['', Validators.compose([
        Validators.required,
      ])],
      precioVenta: [0, Validators.compose([
        Validators.required, Validators.min(0)
      ])],
      precioCompra: [0, Validators.compose([
        Validators.required, Validators.min(0)
      ])],
      crateAt: [''],
      fechaActualizacion: [''],
    });
  }

  asignarDatosFormulario() {
    this.formularioCreado.setValue({
      cantidad: this.bodega.cantidad,
      sucursal: this.bodega.sucursal,
      precioCompra: this.bodega.precioCompra,
      precioVenta: this.bodega.precioVenta,
      crateAt: this.bodega.createAt,
      fechaActualizacion: this.bodega.fechaActualizacion,
      // fecha: this.cliente.fecha,
    });
    this.producto = this.bodega.producto,
    this.codigo = this.bodega.producto.codigo,
    this.nombreSucursal = this.bodega.sucursal.nombre;
    this.nombreProducto = this.bodega.producto.nombre;
    this.preCantidad = this.bodega.cantidad;
    this.prePcompra = this.bodega.precioCompra;
    this.prePventa = this.prePventa;
  }

  asignarDatosParaGuardar(): boolean {
    this.bodega.cantidad = this.formularioCreado.value.cantidad;
    this.bodega.precioCompra = this.formularioCreado.value.precioCompra;
    this.bodega.precioVenta = this.formularioCreado.value.precioVenta;
    this.bodega.sucursal = this.formularioCreado.value.sucursal;
    this.bodega.producto = this.producto;
    this.bodega.nombre = this.formularioCreado.value.sucursal.nombre;
    if (this.bodega.producto.id === undefined || this.bodega.producto.id === null) {
      Swal.fire({
        type: 'error',
        title: `No ha seleccionado un "producto"`,
        text: ` Debe seleccionar un "Poducto para asignar a esta bodega`,
        footer: 'Intente de nuevo',
        });
      return false;
    }
    const idProducto = this.bodega.producto.id.toString();
    const idSucursal = this.bodega.sucursal.id.toString();
    if (idProducto !== null && idProducto !== undefined ) {
      if (idSucursal !== null && idSucursal !== undefined ) {
          this.bodega.idCompuesto = (idSucursal + idProducto);
          console.log(this.bodega.id);
      } else {
        console.error('Id sucursal ERROR formulario Bodega');
      }
    } else {
      console.error('Id producto ERROR formulario Bodega');
    }
    this.bodega.producto.bodegas = null;
    this.bodega.sucursal.bodegas = null;
    this.bodega.sucursal.facturas = null;
    return true;
  }

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
 }


  calcularInversion(cantidad: number, precioCompra: number): string {
    const inversion =  (cantidad * precioCompra);
    const inversionFormat = inversion.toFixed(2);
    return this.formatNumber(parseFloat(inversionFormat));
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
      }
    } else {
      if (cantidad < this.preCantidad) {
        Swal.fire({
          type: 'error',
          title: `Accion No Permitida!`,
          text: `Cantidad en el stock "${this.preCantidad}", aqui Solo puede aumentar el stock`,
          footer: 'Si desea retirar productos del inventario use la Seccion de  "Reportes"',
          });
        return event.target.value = this.preCantidad;
      }
    }

  }

  // recalculamos el valor de cada producto si es modificado
  validarDatos(): boolean {
    const tmpPCompra = this.formularioCreado.value.precioCompra;
    const tmpPVenta = this.formularioCreado.value.precioVenta;
    if ( this.formularioCreado.value.precioCompra > this.formularioCreado.value.precioVenta ) {
      Swal.fire({
        type: 'error',
        title: `Valores No Permitidos`,
        text: `V.venta "${this.formatNumber(tmpPVenta)}" No Puede ser Menor a V.compra "${this.formatNumber(tmpPCompra)}"`,
        footer: 'Intente de nuevo',
        });
      return false;
    } else {
      return true;
    }
  }

  validarDatosParaActualizar() {
    const tmpPCompra = this.formularioCreado.value.precioCompra;
    const tmpCantidad = this.formularioCreado.value.cantidad;
    if (this.prePcompra !== tmpPCompra && this.preCantidad !== tmpCantidad) {
          const diferenciaDeCantidad = tmpCantidad - this.preCantidad;
          console.log('1. cant nueva ingresada ' + tmpCantidad );
          const inversionAnterior = this.prePcompra * this.preCantidad;
          console.log('2. inversion previa ' + inversionAnterior);
          const inversionActual = tmpPCompra * diferenciaDeCantidad;
          console.log('3. inversion nueva ' + inversionActual);
          const inversionTotal = inversionAnterior + inversionActual;
          console.log('4. inversion nueva ' + inversionTotal);
          const nuevoCostoUnidad = ( inversionTotal / (tmpCantidad));
          console.log('4. Nuevo costo ' + nuevoCostoUnidad);
          this.bodega.precioCompra = this.redondearPrecioCompra(nuevoCostoUnidad);
          console.log('4. Nuevo costo formateado' + this.bodega.precioCompra);
    }
  }
}

