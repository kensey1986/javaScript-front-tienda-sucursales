import { Producto } from './../../productos/interfaces/producto';
import { Sucursal } from 'src/app/sucursales/interfaces/sucursal';
export class Bodega {
  id: number;
  createAt: Date;
  cantidad: number;
  sucursal: Sucursal;
  producto: Producto;
  fechaActualizacion: Date;
  precioVenta: number;
  precioCompra: number;
}
