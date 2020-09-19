import { Injectable,  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalFacturaBuscarService {

  modal = false;

  constructor() { }

  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }
}
