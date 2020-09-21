import { FuncionesService } from './../../generales/services/funciones.service';
import { Injectable } from '@angular/core';
import { Factura } from '../interfaces/factura';
import { HttpClient,  HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  public  urlEndPoint: string;

  constructor(
                public  http: HttpClient,
                public funcionesService: FuncionesService
                ) {
                  this.urlEndPoint = `${this.funcionesService.setUrlBase()}api/facturas`;
                }

  public getFacturas(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
           // console.log('FacturaService: tap 1');
           (response.content as Factura[]).forEach(factura => {
            // console.log(factura.descripcion);
           });
          }),
          map((response: any ) => {
            (response.content as Factura[]).map( factura => {
              factura.nombre = factura.descripcion.toUpperCase();
              return factura;
          });
            return response;
          }),
          tap(response => {
            // console.log('FacturaService: tap2');
            (response.content as Factura[]).forEach(factura => {
            //  console.log(factura.descripcion);
            });
         }));
  }

  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }



  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  create(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.urlEndPoint, factura);
  }

  createFactura(factura: Factura): Observable<Factura> {
    return this.http.post(this.urlEndPoint, factura).pipe(
      map((response: any ) => response.factura as Factura ),
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

  filtrarFacturas(term: string): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.urlEndPoint}/filtrar-facturas/${term}`);
  }

  getFacturaUltima(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.urlEndPoint}/ultimafactura`);
  }

  getFiltrarFacturasPorFecha(term1: string, term2: string): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.urlEndPoint}/fecha1/${term1}/fecha2/${term2}`);
  }

}
