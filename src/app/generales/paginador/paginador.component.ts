import { Component,  Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
})

export class PaginadorComponent implements  OnChanges {
  @Input() paginador: any;
  @Input() link: string;

  paginas: number [];
  desde: number;
  hasta: number;

  constructor() { }

  ngOnChanges() {
    this.desde = Math.min(
                  Math.max(1, this.paginador.number - 4),
                  this.paginador.totalPages - 5);
    this.hasta = Math.max(
                  Math.min(this.paginador.totalPages,
                    this.paginador.number + 4), 6);

    if (this.paginador.totalPages > 5) {
      this.paginas = new Array(this.hasta - this.desde + 1 ).fill(0).map(
        // tslint:disable-next-line: variable-name
        (_valor, indice) => indice + this.desde);
    } else {
    // tslint:disable-next-line: variable-name
    this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice + 1);
    }
  }

}

