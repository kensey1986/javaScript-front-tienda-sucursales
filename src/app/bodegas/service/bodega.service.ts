import { FuncionesService } from '../../generales/services/funciones.service';
import { Injectable } from '@angular/core';
import { Bodega } from '../models/bodega';
import { HttpClient,  HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';




@Injectable({
  providedIn: 'root'
})

export class BodegaService {
  public   bodegaTmp: Bodega;
  public  urlEndPoint: string;

  constructor(
                public  http: HttpClient,
                public  router: Router,
                public funcionesService: FuncionesService
                ) {
                  this.urlEndPoint = `${this.funcionesService.setUrlBase()}api/bodegas`;
                }

  public getBodega(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
           // console.log('ReporteService: tap 1');
           (response.content as Bodega[]).forEach(reporte => {
            // console.log(Reporte.descripcion);
           });
          }),
          map((response: any ) => {
            (response.content as Bodega[]).map( reporte => {
              return reporte;
          });
            return response;
          }),
          tap(response => {
            // console.log('ReporteService: tap2');
            (response.content as Bodega[]).forEach(reporte => {
            //  console.log(Reporte.descripcion);
            });
         }));
  }




  getBodegas(id: number): Observable<Bodega> {
    return this.http.get<Bodega>(`${this.urlEndPoint}/${id}`).pipe(
      catchError (e => {
        if (e.status !== 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getListadoBodegas(): Observable<Bodega[]> {
    return this.http.get<Bodega[]>(
      `${this.urlEndPoint}`
    );
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  update(bodega: Bodega): Observable<any> {
    return this.http.put<any>(
      `${this.urlEndPoint}/${bodega.id}`,
      bodega).pipe(
        map((response: any ) => response.bodega as Bodega ),
        catchError((e) => {
          if (e.status === 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            const prueba = e.error.dato;
            const tmp = prueba.split(`'`);
            Swal.fire({
              type: 'error',
              title: `${tmp[1]}`,
              text: `Ya existe un registro Con este dato`,
            });
          }
          return throwError(e);
        })
      );
  }

  create(bodega: Bodega): Observable<Bodega> {
    return this.http.post<Bodega>(this.urlEndPoint, bodega);
  }

  createBodega(bodega: Bodega): Observable<Bodega> {
    this.bodegaTmp = bodega;
    return this.http.post(this.urlEndPoint, bodega).pipe(
      map((response: any ) => response.bodega as Bodega ),
      catchError((e) => {
        if (e.status === 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          const prueba = e.error.dato;
          const tmp = prueba.split(`'`);
          Swal.fire({
            type: 'error',
            title: `Producto "${this.bodegaTmp.producto.nombre}",  ya cuenta con una "Bodega"`,
            text: `En la sucursal "${this.bodegaTmp.sucursal.nombre}"`,
          });
        }
        return throwError(e);
      })
    );
  }



}
