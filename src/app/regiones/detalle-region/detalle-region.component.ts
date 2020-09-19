import { Component, Input } from '@angular/core';
import { Region } from '../interfaces/region';
import { RegionService  } from '../services/region.service';
import { ModalRegionService  } from '../services/modal-region.service';

@Component({
  selector: 'app-detalle-region',
  templateUrl: './detalle-region.component.html',
  styleUrls: ['../../generales/css/modal.css']
})

export class DetalleRegionComponent   {

  @Input() region: Region;
  titulo = 'Detalle Barrio';

  constructor(
    public  regionService: RegionService,
    public modalRegionService: ModalRegionService,
   ) { }

  cerrarModal() {
    this.modalRegionService.cerrarModal();
  }

}
