import { Producto } from '../../productos/interfaces/producto';
export class ItemFactura {


  producto: Producto;
  cantidad = 1;
  importe: number;
  precioVendido: number;
  precioComprado: number;
  desPorcentaje: number;
  desDinero: number;

  public calcularImporte() {
    const importe = this.cantidad * this.producto.precio;
    if (this.desPorcentaje !== null && this.desPorcentaje > 0) {
      const porcentaje = (importe * (this.desPorcentaje / 100)) ;
      return importe - porcentaje;
    } else {
      return importe;
    }
  }

  public calcularGanancia() {
    return this.cantidad * (this.producto.precio - this.producto.precioCompra);
  }

}
