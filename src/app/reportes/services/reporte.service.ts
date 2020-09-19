import { FuncionesService } from './../../generales/services/funciones.service';
import { Injectable } from '@angular/core';
import { Reporte } from '../interfaces/reporte';
import { HttpClient,  HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  public  urlEndPoint: string;

  constructor(
                public  http: HttpClient,
                public funcionesService: FuncionesService
                ) {
                  this.urlEndPoint = `${this.funcionesService.setUrlBase()}api/reportes`;
                }

  public getReportes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
           // console.log('ReporteService: tap 1');
           (response.content as Reporte[]).forEach(reporte => {
            // console.log(Reporte.descripcion);
           });
          }),
          map((response: any ) => {
            (response.content as Reporte[]).map( reporte => {
              return reporte;
          });
            return response;
          }),
          tap(response => {
            // console.log('ReporteService: tap2');
            (response.content as Reporte[]).forEach(reporte => {
            //  console.log(Reporte.descripcion);
            });
         }));
  }

  getReporte(id: number): Observable<Reporte> {
    return this.http.get<Reporte>(`${this.urlEndPoint}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  update(reporte: Reporte): Observable<any> {
    return this.http.put<any>(
      `${this.urlEndPoint}/${reporte.id}`,
      reporte).pipe(
        map((response: any ) => response.cliente as Reporte ),
        catchError (e => {

          if (e.status === 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }
  create(reporte: Reporte): Observable<Reporte> {
    return this.http.post<Reporte>(this.urlEndPoint, reporte);
  }

  createReporte(reporte: Reporte): Observable<Reporte> {
    return this.http.post(this.urlEndPoint, reporte).pipe(
      map((response: any ) => response.Reporte as Reporte ),
      catchError (e => {
        if (e.status === 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  filtrarReportes(term: string): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.urlEndPoint}/filtrar-reportes/${term}`);
  }

  getReporteUltima(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.urlEndPoint}/ultimareporte`);
  }

  getFiltrarReportesPorFecha(term1: string, term2: string): Observable<Reporte[]> {
      return this.http.get<Reporte[]>(`${this.urlEndPoint}/fecha1/${term1}/fecha2/${term2}`);
  }

}
