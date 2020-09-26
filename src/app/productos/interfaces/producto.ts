import { Sucursal } from 'src/app/sucursales/interfaces/sucursal';
import { Reporte } from './../../reportes/interfaces/reporte';
export class Producto {
  id: number;
  descripcion: string;
  nombre: string;
  createAt: Date;
  fechaVenta: Date;
  precio: number;
  precioCompra: number;
  cantidad: number;
  foto: string;
  codigo: string;
  reportes: Array<Reporte> = [];
  sucursales: Array<Sucursal> = [];
}


