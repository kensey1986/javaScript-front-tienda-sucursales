import { Component, OnInit } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
import { ClienteService } from '../services/cliente.service';
import { Region } from '../../regiones/interfaces/region';
import { RegionService } from '../../regiones/services/region.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl,
         FormGroupDirective,
         NgForm, Validators,
         FormBuilder, FormGroup} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import Swal from 'sweetalert2';
import { LoadingService } from '../../generales/services/loading.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html'
})


export class FormClienteComponent implements OnInit {

  formularioCreado: FormGroup;
  minDate = new Date(1930, 1, 1);
  maxDate = new Date();
  cliente: Cliente = new Cliente();
  regiones: Region[];
  titulo = 'Crear Cliente';
  errores: string[];

  constructor(
              public  clienteService: ClienteService,
              public  regionService: RegionService,
              public  router: Router,
              public  activatedRoute: ActivatedRoute,
              public loadingService: LoadingService,
              public formBuilder: FormBuilder
              ) { }

  ngOnInit() {
    this.loadingService.abrirModal();
    this.crearFormulario();
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.loadingService.abrirModal();
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
            this.clienteService.getCliente(id).subscribe(
            (cliente) => {this.cliente = cliente,
                          this.asignarDatosFormulario();
            });
        }
      });
    this.regionService.getRegionLista().subscribe(regiones => this.regiones = regiones);
    this.loadingService.cerrarModal();
  }

  public create(): void {
    this.loadingService.abrirModal();
    this.asignarDatosParaGuardar();
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
         this.router.navigate(['/clientes']),
         Swal.fire({
           type: 'success',
           title: 'Nuevo Cliente',
           text: `${cliente.nombre} `,
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
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente)
    .subscribe(
      cliente => {
        this.router.navigate(['/clientes']),
        Swal.fire({
          type: 'success',
          title: 'Cliente',
          text: `${cliente.nombre} `,
          footer: 'Actualizado con Exito!',
          });
        this.loadingService.cerrarModal();
      },
      err => {
        this.errores = err.error.errors as string[];
        Swal.fire({
          type: 'error',
          title: `El documento '${this.cliente.documento}' `,
          text: `ya esta se encuentra registrado`,
          footer: 'Intente de nuevo',
          });
        this.loadingService.cerrarModal();
        console.error(err);
      }
    );
  }

  public compararRegion(o1: Region, o2: Region): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  // tratamiento a formulario
  crearFormulario() {
    this.formularioCreado = this.formBuilder.group({
      nombre: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])],
      apellido: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])],
      documento: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(11)
      ])],
      email: ['', Validators.compose([
         Validators.email
      ])],
      celular1: ['', Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(10)
      ])],
      celular2: ['', Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(10)
      ])],
      telefono: ['', Validators.compose([
        Validators.minLength(7),
        Validators.maxLength(7)
      ])],
      direccion: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(50)
      ])],
      region: ['', Validators.compose([
        Validators.required,
      ])],
    });
  }

  asignarDatosFormulario() {
    this.formularioCreado.setValue({
      nombre: this.cliente.nombre,
      apellido: this.cliente.apellido,
      documento: this.cliente.documento,
      email: this.cliente.email,
      celular1: this.cliente.celular1,
      celular2: this.cliente.celular2,
      telefono: this.cliente.telefono,
      direccion: this.cliente.direccion,
      region: this.cliente.region,
      // fecha: this.cliente.fecha,
    });
  }

  asignarDatosParaGuardar() {
    this.cliente.nombre = this.formularioCreado.value.nombre,
    this.cliente.apellido = this.formularioCreado.value.apellido,
    this.cliente.documento = this.formularioCreado.value.documento ,
    this.cliente.email = this.formularioCreado.value.email,
    this.cliente.celular1 = this.formularioCreado.value.celular1,
    this.cliente.direccion = this.formularioCreado.value.direccion,
    // this.cliente.fecha = this.formularioCreado.value.fecha;
    this.cliente.region = this.formularioCreado.value.region;
    if ( this.formularioCreado.value.celular2 !== '' ) {
      this.cliente.celular2 = this.formularioCreado.value.celular2;
    }
    if ( this.formularioCreado.value.telefono !== '' ) {
      this.cliente.telefono = this.formularioCreado.value.telefono;
    }
  }

}
