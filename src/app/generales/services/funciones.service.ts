import { LoadingService } from './loading.service';
import { Sucursal } from './../../sucursales/interfaces/sucursal';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

 public  urlBase = 'http://localhost:8080/';
 // public urlBase = 'https://sifi-api-rest-java.herokuapp.com/';

  constructor(
    public loadingService: LoadingService
  ) { }

  formatNumber(numero: number): string {
      if (numero !== null && numero !== undefined) {
        const separador = '.'; // separador para los miles
        const sepDecimal = ','; // separador para los decimales
        let num: string;
        num = numero.toString();
        num += '';
        const splitStr = num.split('.');
        let splitLeft = splitStr[0];
        const splitRight = splitStr.length > 1 ? sepDecimal + splitStr[1] : '';
        const regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
        splitLeft = splitLeft.replace(regx, '$1' + separador + '$2');
        }
        num = '$' + splitLeft + splitRight;
        return num;
      }
    }
  validarInputs(opcion: string, dato: any, nombreCampo: string, min: number, max: number ): boolean {
    switch (opcion) {
      case 'numero' : {
          if (dato < 0 || dato === null || dato === undefined ) {
            Swal.fire({
              type: 'error',
              title: `El campo '${nombreCampo}`,
              text: `no debe estar vacio ni contener letras`,
              footer: 'Intente de nuevo',
              });
            this.loadingService.cerrarModal();
            return true;
          } else if ( dato < min ) {
            console.log(dato);
            console.log(min);
            Swal.fire({
              type: 'error',
              title: 'El valor minimo del Campo ',
              text: `'${nombreCampo}' no es valido`,
              footer: 'Intente de nuevo',
              });
            this.loadingService.cerrarModal();
            return true;
          } else if ( dato >= max ) {
            Swal.fire({
              type: 'error',
              title: 'El valor maximo del Campo',
              text: `'${nombreCampo}' no es valido`,
              footer: 'Intente de nuevo',
              });
            this.loadingService.cerrarModal();
            return true;
          }
          return false;
      }

      case 'texto' : {
        if ( dato === null || dato === undefined ) {
          Swal.fire({
            type: 'error',
            title: `El campo '${nombreCampo}'`,
            text: `No puede estar vacio `,
            footer: 'Intente de nuevo',
            });
          this.loadingService.cerrarModal();
          return true;

        } else if ( dato.toString().length < min ) {
          Swal.fire({
            type: 'error',
            title: `El campo '${nombreCampo}' `,
            text: `debe contener minimo '${min}' caracteres`,
            footer: 'Intente de nuevo',
          });
          this.loadingService.cerrarModal();
          return true;

        } else if ( dato.toString().length > max ) {
          Swal.fire({
            type: 'error',
            title: `El campo '${nombreCampo}' `,
            text: `debe contener maximo '${max}' caracteres`,
            footer: 'Intente de nuevo',
            });
          this.loadingService.cerrarModal();
          return true;
        }
        return false;
       }
    }
  }

  setTitulo(): string {
    let sucursal: Sucursal;
    let titulo: string;
    sucursal =   JSON.parse(sessionStorage.getItem('sucursal')) as Sucursal;
    titulo = `Sucursal: ${sucursal.nombre}`;
    return titulo;
  }

  getDatos(): Sucursal {
    let sucursal: Sucursal;
    sucursal =   JSON.parse(sessionStorage.getItem('sucursal')) as Sucursal;
    return sucursal;
  }

  setUrlBase(): string {
    // se settea la url para los servicios
    return (this.urlBase);
  }

}
