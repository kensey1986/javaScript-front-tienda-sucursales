import { Producto } from './../../productos/interfaces/producto';
import { Sucursal } from 'src/app/sucursales/interfaces/sucursal';
import { Reporte } from 'src/app/reportes/interfaces/reporte';
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
  reportes: Array<Reporte> = [];

}
