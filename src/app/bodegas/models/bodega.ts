import { Producto } from './../../productos/interfaces/producto';
import { Sucursal } from 'src/app/sucursales/interfaces/sucursal';
export class Bodega {
  id: number;
  idCompuesto: string;
  createAt: Date;
  cantidad: number;
  sucursal: Sucursal;
  producto: Producto;
  fechaActualizacion: Date;
  nombre: string;
  precioVenta: number;
  precioCompra: number;
}
