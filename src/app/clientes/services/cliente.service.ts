import { FuncionesService } from './../../generales/services/funciones.service';
import { Injectable } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
import { HttpClient,  HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



@Injectable()
export class ClienteService {
public  urlEndPoint: string;


constructor(public  http: HttpClient,
            public  router: Router,
            public funcionesService: FuncionesService
            ) {
              this.urlEndPoint = `${this.funcionesService.setUrlBase()}api/clientes`;
            }


 public getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
           // console.log('ClienteService: tap 1');
           (response.content as Cliente[]).forEach(cliente => {
           //  console.log(cliente.nombre);
           });
          }),
          map((response: any ) => {
            (response.content as Cliente[]).map( cliente => {
              cliente.nombre = cliente.nombre.toUpperCase();
              return cliente;
          });
            return response;
          }),
          tap(response => {
            // console.log('ClienteService: tap2');
            (response.content as Cliente[]).forEach(cliente => {
            //  console.log(cliente.nombre);
            });
         }));
  }

  getListadoClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(
      `${this.urlEndPoint}`
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any ) => response.cliente as Cliente ),
      catchError (e => {
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

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError (e => {
        if (e.status !== 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(
      `${this.urlEndPoint}/${cliente.id}`,
      cliente).pipe(
        map((response: any ) => response.cliente as Cliente ),
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

  delete(id: number): Observable<Cliente> {
    return this.http.delete(
      `${this.urlEndPoint}/${id}`).pipe(
        map((response: any ) => response.cliente as Cliente ),
        catchError (e => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/uploadimgcliente`,
   formData, {
      reportProgress: true
  });
    return this.http.request(req);
  }

  filtrarClientes(term: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.urlEndPoint}/filtrar-clientes/${term}`);
  }

}
