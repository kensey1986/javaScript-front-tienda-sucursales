import { Component, OnInit } from '@angular/core';
import { Region } from '../interfaces/region';
import { RegionService } from '../services/region.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingService } from '../../generales/services/loading.service';

@Component({
  selector: 'app-form-regiones',
  templateUrl: './form-regiones.component.html'
})

export class FormRegionesComponent implements OnInit {

  region: Region = new Region();
  titulo = 'Crear Region';
  errores: string[];
  constructor(
    public  regionService: RegionService,
    public  router: Router,
    public  activatedRoute: ActivatedRoute,
    public loadingService: LoadingService
    ) { }

  ngOnInit() {
    this.cargarRegion();
  }

  cargarRegion(): void {
    this.activatedRoute.params.subscribe(
      params => {
        const id = params.id;
        if (id) {
            this.regionService.getRegion(id).subscribe(
            (region) => {this.region = region,
              this.loadingService.cerrarModal();
            });
        }
      }
    );
  }

  public create(): void {
    this.loadingService.abrirModal();
    this.regionService.create(this.region).subscribe(
      region => {
        this.router.navigate(['/regiones']),
        Swal.fire({
          type: 'success',
          title: `Nuevo Barrio`,
          text: `${region.nombre}`,
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
    this.regionService.update(this.region)
    .subscribe(
      region => {
        this.router.navigate(['/regiones']),
        Swal.fire({
          type: 'success',
          title: `Barrio`,
          text: `${region.nombre}`,
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

}

