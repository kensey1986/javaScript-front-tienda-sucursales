import { Bodega } from './../../bodegas/models/bodega';
import { Reporte } from './../../reportes/interfaces/reporte';
export class Producto {
  id: number;
  descripcion: string;
  nombre: string;
  createAt: Date;
  foto: string;
  codigo: string;
  cantidad: number;
  precio: number;
  precioCompra: number;
  fechaVenta: Date;
  reportes: Array<Reporte> = [];
  bodegas: Array<Bodega> = [];
  sucursal: string;
}


