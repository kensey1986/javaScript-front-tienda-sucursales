import { Injectable, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalSucursalService {

  modal = false;

  // tslint:disable-next-line: variable-name
  public  _notificarUpload = new EventEmitter<any>();

  constructor() { }

  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }
}
