import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pagina404',
  templateUrl: './pagina404.component.html',
  styleUrls: ['./pagina404.component.css']
})
export class Pagina404Component implements OnInit {

  constructor(
    public  activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      console.log(params);
      // const id = +params.get('id');
      // this.facturaService.getFactura(id)
      // .subscribe(factura => {this.factura = factura,
      //      this.loadingService.cerrarModal();
      // });
    });
  }

}
