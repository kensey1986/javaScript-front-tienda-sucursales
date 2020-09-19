
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if (arg === '' || arg.length < 3 || arg === undefined ) { return value; }
    const resultFacturas = [];
    for (const factura of value) {
      if (factura.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultFacturas.push(factura);
      }
    }
    return resultFacturas;
  }

}
