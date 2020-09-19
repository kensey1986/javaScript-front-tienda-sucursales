import { FuncionesService } from './../../generales/services/funciones.service';
import { Injectable } from '@angular/core';
import { Region } from '../interfaces/region';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Injectable()
export class RegionService {

public  urlEndPoint: string;

constructor(public  http: HttpClient,
            public  router: Router,
            public funcionesService: FuncionesService
            ) {
              this.urlEndPoint = `${this.funcionesService.setUrlBase()}api/regiones`;
            }

 public getRegiones(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
           // console.log('RegionService: tap 1');
           (response.content as Region[]).forEach(region => {
           //  console.log(region.nombre);
           });
          }),
          map((response: any ) => {
            (response.content as Region[]).map( region => {
              region.nombre = region.nombre.toUpperCase();
              return region;
          });
            return response;
          }),
          tap(response => {
            //  console.log('RegionService: tap2');
            (response.content as Region[]).forEach(region => {
            //  console.log(region.nombre);
            });
         }));

  }

  public getRegionLista(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint);
  }

  create(region: Region): Observable<Region> {
    return this.http.post(this.urlEndPoint, region).pipe(
      map((response: any ) => response.region as Region ),
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

  getRegion(id): Observable<Region> {
    return this.http.get<Region>(`${this.urlEndPoint}/${id}`).pipe(
      catchError (e => {
        if (e.status !== 401 && e.error.mensaje) {
          this.router.navigate(['/regiones']);
          console.error(e.error.mensaje);
        }
        this.router.navigate(['/regiones']);
        return throwError(e);
      })
    );
  }

  update(region: Region): Observable<any> {
    return this.http.put<any>(
      `${this.urlEndPoint}/${region.id}`,
      region).pipe(
        map((response: any ) => response.region as Region ),
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

  delete(id: number): Observable<Region> {
    return this.http.delete(
      `${this.urlEndPoint}/${id}`).pipe(
        map((response: any ) => response.region as Region ),
        catchError (e => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }



}
