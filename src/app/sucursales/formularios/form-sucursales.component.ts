import { Component, OnInit } from '@angular/core';
import { Sucursal } from '../interfaces/sucursal';
import { SucursalService } from '../services/sucursal.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingService } from '../../generales/services/loading.service';

@Component({
  selector: 'app-form-sucursales',
  templateUrl: './form-sucursales.component.html'
})

export class FormSucursalesComponent implements OnInit {

  sucursal: Sucursal = new Sucursal();
  titulo = 'Crear Sucursal';
  errores: string[];
  constructor(
    public  sucursalService: SucursalService,
    public  router: Router,
    public  activatedRoute: ActivatedRoute,
    public loadingService: LoadingService
    ) { }

  ngOnInit() {
    this.cargarSucursal();
  }

  cargarSucursal(): void {
    this.loadingService.abrirModal();
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
            this.sucursalService.getSucursal(id).subscribe(
            (sucursal) => {this.sucursal = sucursal, console.log(this.sucursal); });
        }
      }
    );
    this.loadingService.cerrarModal();
  }

  public create(): void {
    this.loadingService.abrirModal();
    this.sucursal.numeroFactura = this.sucursal.numeroFactura - 1;
    this.sucursalService.create(this.sucursal).subscribe(
      sucursal => {
        this.router.navigate(['/sucursales']),
        Swal.fire({
          type: 'success',
          title: `Nuevo Sucursal`,
          text: `${sucursal.nombre}`,
          footer: `Creado con Exito!`
        });
        this.loadingService.cerrarModal();
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error(err);
        this.loadingService.cerrarModal();
      }
    );
  }

  update(): void {
    this.loadingService.abrirModal();
    this.sucursal.numeroFactura = this.sucursal.numeroFactura - 1;
    this.sucursalService.update(this.sucursal)
    .subscribe(
      sucursal => {
        this.router.navigate(['/sucursales']),
        Swal.fire({
          type: 'success',
          title: `Sucursal`,
          text: `${sucursal.nombre}`,
          footer: `Actualizada con Exito!`
        });
        this.loadingService.cerrarModal();
      },
      err => {
        this.errores = err.error.errors as string[];
        this.loadingService.cerrarModal();
      }
    );
  }

}


