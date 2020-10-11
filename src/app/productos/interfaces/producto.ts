import { Bodega } from './../../bodegas/models/bodega';
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
  bodegas: Array<Bodega> = [];
  sucursal: string;
}


