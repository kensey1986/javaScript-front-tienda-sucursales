import { Component} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  public autor: any = {  nombre: 'Ing. Manuel yivan', apellido: ' Rodriguez Carreño', cel: 'Cel: 315-4025642 '};
  public autor2: any = {  nombre: 'Ing. Jose Luis', apellido: ' Rodriguez Peñaranda', cel: 'Cel: 321-6860452 '};
}
