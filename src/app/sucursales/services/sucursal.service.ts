import { FuncionesService } from './../../generales/services/funciones.service';
import { Injectable } from '@angular/core';
import { Sucursal } from '../interfaces/sucursal';
import { HttpClient } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Injectable()
export class SucursalService {

public  urlEndPoint: string;

constructor(public  http: HttpClient,
            public  router: Router,
            public funcionesService: FuncionesService
            ) {
              this.urlEndPoint = `${this.funcionesService.setUrlBase()}api/sucursales`;
            }

 public getSucursales(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
           // console.log('RegionService: tap 1');
           (response.content as Sucursal[]).forEach(sucursal => {
           //  console.log(region.nombre);
           });
          }),
          map((response: any ) => {
            (response.content as Sucursal[]).map( sucursal => {
              sucursal.nombre = sucursal.nombre.toUpperCase();
              return sucursal;
          });
            return response;
          }),
          tap(response => {
            //  console.log('RegionService: tap2');
            (response.content as Sucursal[]).forEach(sucursal => {
            //  console.log(region.nombre);
            });
         }));

  }

  public getSucursalLista(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(this.urlEndPoint);
  }

  create(sucursal: Sucursal): Observable<Sucursal> {
    return this.http.post(this.urlEndPoint, sucursal).pipe(
      map((response: any ) => response.sucursal as Sucursal ),
      catchError (e => {
        if (e.status === 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          const prueba = (e.error.dato);
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

  getSucursal(id): Observable<Sucursal> {
    return this.http.get<Sucursal>(`${this.urlEndPoint}/${id}`).pipe(
      catchError (e => {
        if (e.status !== 401 && e.error.mensaje) {
          this.router.navigate(['/sucursales']);
          console.error(e.error.mensaje);
        }
        this.router.navigate(['/sucursales']);
        return throwError(e);
      })
    );
  }

  update(sucursal: Sucursal): Observable<any> {
    return this.http.put<any>(
      `${this.urlEndPoint}/${sucursal.id}`,
      sucursal).pipe(
        map((response: any ) => response.sucursal as Sucursal ),
        catchError (e => {
          if (e.status === 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            const prueba = (e.error.dato);
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

  delete(id: number): Observable<Sucursal> {
    return this.http.delete(
      `${this.urlEndPoint}/${id}`).pipe(
        map((response: any ) => response.sucursal as Sucursal ),
        catchError (e => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }



}
