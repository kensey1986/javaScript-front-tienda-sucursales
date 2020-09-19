import { ItemFactura } from './item-factura';
import { Cliente } from '../../clientes/interfaces/cliente';
import { User } from '../../users/interfaces/user';
export class Factura {
  id: number;
  descripcion = 'Factura Venta';
  observacion: string;
  nombre: string;
  createAt: string;
  numeroFactura: number;
  items: Array<ItemFactura> = [];
  cliente: Cliente;
  usuario: User;
  descuento = 0;
  total: number;
  totalGanancia: number;


  aplicarDescuento(desc: number) {
    this.total -= desc;
    console.log(this.total);
  }

  calcularGranTotal(): number {
    this.total = 0;
    this.items.forEach((item: ItemFactura) => {
      this.total +=  item.calcularImporte();
    });
    if (this.descuento > 0) {
      this.total -= this.descuento;
    }
    return this.total;
  }
  calcularGananciaTotal(): number {
    this.totalGanancia = 0;
    this.items.forEach((item: ItemFactura) => {
      this.totalGanancia +=  item.calcularGanancia();
    });
    if (this.descuento > 0) {
      this.totalGanancia -= this.descuento;
    }
    return this.totalGanancia;
  }

}