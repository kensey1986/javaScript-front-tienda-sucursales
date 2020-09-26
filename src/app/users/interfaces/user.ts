// import { Sucursal } from './../../sucursales/interfaces/sucursal';
import { Region } from '../../regiones/interfaces/region';
import { Factura } from '../../facturas/interfaces/factura';
export class User {
  id: number;
  fecha: string;
  documento: string;
  nombre: string;
  apellido: string;
  username: string;
  password: string;
  createAt: string;
  direccion: string;
  telefono: string;
  celular1: string;
  celular2: string;
  email: string;
  foto: string;
  region: Region;
  enabled: boolean;
  roles: string [] = [];
  // sucursal: Sucursal;
  facturas: Array<Factura> = [];
  // facturas: Array<Factura> = [];
}
