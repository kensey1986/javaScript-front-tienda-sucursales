import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUserService {
  modal = false;
  // tslint:disable-next-line: variable-name
  _notificarUpload = new EventEmitter<any>();
  constructor() { }
  get notificarUpload(): EventEmitter<any> {
    return this._notificarUpload;
  }

  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }
}
