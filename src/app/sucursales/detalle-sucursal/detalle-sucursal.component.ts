
import { Component, Input } from '@angular/core';
import { Sucursal } from '../interfaces/sucursal';
import { SucursalService  } from '../services/sucursal.service';
import { ModalSucursalService  } from '../services/modal-sucursal.service';

@Component({
  selector: 'app-detalle-sucursal',
  templateUrl: './detalle-sucursal.component.html',
  styleUrls: ['../../generales/css/modal.css']
})

export class DetalleSucursalComponent   {

  @Input() sucursal: Sucursal;
  titulo = 'Detalle Sucursal';

  constructor(
    public  sucursalService: SucursalService,
    public modalSucursalService: ModalSucursalService,
   ) { }

  cerrarModal() {
    this.modalSucursalService.cerrarModal();
  }

}
