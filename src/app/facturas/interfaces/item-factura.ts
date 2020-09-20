import { Producto } from '../../productos/interfaces/producto';
export class ItemFactura {


  producto: Producto;
  cantidad = 1;
  importe: number;
  precioVendido: number;
  precioComprado: number;

  public calcularImporte() {
    return this.cantidad * this.producto.precio;
  }

  public calcularGanancia() {
    return this.cantidad * (this.producto.precio - this.producto.precioCompra);
  }

}
