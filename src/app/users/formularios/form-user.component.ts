import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { Region } from '../../regiones/interfaces/region';
import { RegionService } from '../../regiones/services/region.service';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';
import { LoadingService } from '../../generales/services/loading.service';
import {  Validators,
  FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html'
})
export class FormUserComponent implements OnInit {

  hide = true;
  minDate = new Date(1930, 1, 1);
  maxDate = new Date();
  user: User = new User();
  regiones: Region[];
  titulo = 'Crear Usuarios';
  errores: string[];
  formularioCreado: FormGroup;

  constructor(
    public  userService: UserService,
    public  router: Router,
    public  regionService: RegionService,
    public  activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    public formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.loadingService.abrirModal();
    this.crearFormulario();
    this.cargarUser();
  }

  cargarUser(): void {
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
          this.userService.getUser(id).subscribe(
            user =>  {this.user = user,
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
    this.userService.create(this.user).subscribe(
      user => {
        this.router.navigate(['/users']),
        Swal.fire({
          type: 'success',
          title: `Nuevo Usuario`,
          text: `${user.nombre}`,
          footer: `Creado con Exito!`
        });
        this.loadingService.cerrarModal();
      },
      err => {
        this.errores = err.error.errors as string[];
        this.loadingService.cerrarModal();
      }
    );
  }

  update(): void {
    this.loadingService.abrirModal();
    this.asignarDatosParaGuardar();
    this.userService.update(this.user)
    .subscribe(
      user => {
        this.router.navigate(['/users']),
        // console.log(this.user),
        Swal.fire({
          type: 'success',
          title: `Usuario`,
          text: `${user.nombre}`,
          footer: `Actualizado con Exito!`
        });
        this.loadingService.cerrarModal();
      },
      err => {
        this.errores = err.error.errors as string[];
        this.loadingService.cerrarModal();
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
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])],
      nick: ['', Validators.compose([
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
        Validators.maxLength(10)
      ])],
      email: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      celular1: ['', Validators.compose([
        Validators.required,
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
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])],
      region: ['', Validators.required],
      fecha: ['', Validators.required],
    });
  }

  asignarDatosFormulario() {
    this.formularioCreado.setValue({
      nombre: this.user.nombre,
      apellido: this.user.apellido,
      documento: this.user.documento,
      email: this.user.email,
      celular1: this.user.celular1,
      celular2: this.user.celular2,
      telefono: this.user.telefono,
      direccion: this.user.direccion,
      region: this.user.region,
      fecha: this.user.fecha,
      nick: this.user.username,
      password: this.user.password,
    });
  }

  asignarDatosParaGuardar() {
    this.user.nombre = this.formularioCreado.value.nombre,
    this.user.apellido = this.formularioCreado.value.apellido,
    this.user.documento = this.formularioCreado.value.documento ,
    this.user.email = this.formularioCreado.value.email,
    this.user.celular1 = this.formularioCreado.value.celular1,
    this.user.direccion = this.formularioCreado.value.direccion,
    this.user.region = this.formularioCreado.value.region,
    this.user.fecha = this.formularioCreado.value.fecha;
    if ( this.formularioCreado.value.celular2 !== '' ) {
      this.user.celular2 = this.formularioCreado.value.celular2;
    }
    if ( this.formularioCreado.value.telefono !== '' ) {
      this.user.telefono = this.formularioCreado.value.telefono;
    }
    this.user.password = this.formularioCreado.value.password;
    this.user.username = this.formularioCreado.value.nick;
  }

}
