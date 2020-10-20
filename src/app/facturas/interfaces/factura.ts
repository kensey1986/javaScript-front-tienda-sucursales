import { ItemFactura } from './item-factura';
import { Cliente } from '../../clientes/interfaces/cliente';
import { Sucursal } from '../../sucursales/interfaces/sucursal';
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
  sucursal: Sucursal;
  usuario: User;
  total: number;
  totalFactura: number;
  totalGanancia: number;


  aplicarDescuento(desc: number) {
    this.total -= desc;
  }

  calcularGranTotal(): number {
    this.total = 0;
    this.items.forEach((item: ItemFactura) => {
      this.total +=  item.calcularImporte();
    });
    return this.total;
  }


  calcularGananciaTotal(): number {
    this.totalGanancia = 0;
    this.items.forEach((item: ItemFactura) => {
      this.totalGanancia +=  item.calcularGanancia();
    });
    return this.totalGanancia;
  }


}
