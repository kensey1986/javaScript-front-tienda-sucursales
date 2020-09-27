import { Bodega } from './../../bodegas/models/bodega';
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
  bodegas: Array<Bodega> = [];
}


