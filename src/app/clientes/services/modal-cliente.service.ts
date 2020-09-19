import { Injectable, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalClienteService {

  modal = false;

  // tslint:disable-next-line: variable-name
  public  _notificarUpload = new EventEmitter<any>();

  constructor() { }

   get notificarUpload(): EventEmitter<any> {
     return this._notificarUpload;
  }
  abrirModal() {
    // console.log(this.modal);
    this.modal = true;
    // console.log('llego al servicio del modal true');
    // console.log(this.modal);
  }

  cerrarModal() {
    this.modal = false;
  }
}
