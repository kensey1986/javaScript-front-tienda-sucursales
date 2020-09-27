import { FuncionesService } from './../../generales/services/funciones.service';
import { Producto } from './../../productos/interfaces/producto';
import { ProductoService } from './../../productos/services/producto.service';
import { Sucursal } from './../../sucursales/interfaces/sucursal';
import { SucursalService } from './../../sucursales/services/sucursal.service';
import { BodegaService } from './../servicios/bodega.service';
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
  templateUrl: './bodegas-formulario.component.html',
  styleUrls: ['./bodegas-formulario.component.css']
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
  producto = new Producto();
  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(
              public  bodegaService: BodegaService,
              public  productoService: ProductoService,
              public  router: Router,
              public  sucursalService: SucursalService,
              public  activatedRoute: ActivatedRoute,
              public loadingService: LoadingService,
              public formBuilder: FormBuilder,
              public funcionesService: FuncionesService
              ) { }

  ngOnInit() {
    this.loadingService.abrirModal();
    this.crearFormulario();
    this.cargarCliente();
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

  formatNumber(cantidad: number): string {
    return this.funcionesService.formatNumber(cantidad);
 }


  // metodos del select autocomplete fin

  cargarListaSucursal() {
    console.log('entro a sucursales');
    this.sucursalService.getSucursalLista()
    .subscribe(sucursales => (this.sucursales = sucursales, console.log(sucursales)));

  }

  cargarCliente(): void {
    this.loadingService.abrirModal();
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        console.log(id);
        if (id) {
            this.bodegaService.getBodegas(id).subscribe(
            (bodega) => {this.bodega = bodega, console.log(bodega),
                          this.asignarDatosFormulario();
            });
        }
      });
    // this.regionService.getRegionLista().subscribe(regiones => this.regiones = regiones);
    this.loadingService.cerrarModal();
  }

  public create(): void {
    this.loadingService.abrirModal();
    this.asignarDatosParaGuardar();
    this.bodegaService.create(this.bodega).subscribe(
      () => {
         this.router.navigate(['/bodegas']),
         Swal.fire({
           type: 'success',
           title: 'Nueva Bodega',
           text: `${this.bodega.cantidad} `,
           footer: 'Creado con Exito!',
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

  update(): void {
    this.loadingService.abrirModal();
    this.asignarDatosParaGuardar();
    // this.cliente.facturas = null;
    this.bodegaService.update(this.bodega)
    .subscribe(
      bodega => {
        this.router.navigate(['/bodegas']),
        Swal.fire({
          type: 'success',
          title: 'Bodega',
          text: `${bodega.id} `,
          footer: 'Actualizado con Exito!',
          });
        this.loadingService.cerrarModal();
      },
      err => {
        this.errores = err.error.errors as string[];
        Swal.fire({
          type: 'error',
          title: `El documento '${this.bodega.id}' `,
          text: `ya esta se encuentra registrado`,
          footer: 'Intente de nuevo',
          });
        this.loadingService.cerrarModal();
        console.error(err);
      }
    );
  }


  // tratamiento a formulario
  crearFormulario() {
    this.formularioCreado = this.formBuilder.group({
      cantidad: ['', Validators.compose([
        Validators.required,
      ])],
      sucursal: ['', Validators.compose([
        Validators.required,
      ])],
    });
  }

  asignarDatosFormulario() {
    this.formularioCreado.setValue({
      cantidad: this.bodega.cantidad,
      sucursal: this.bodega.sucursal,
      // fecha: this.cliente.fecha,
    });
  }

  asignarDatosParaGuardar() {
    this.bodega.cantidad = this.formularioCreado.value.cantidad;
    this.bodega.sucursal = this.formularioCreado.value.sucursal;
    this.bodega.producto = this.producto;
  }

}

