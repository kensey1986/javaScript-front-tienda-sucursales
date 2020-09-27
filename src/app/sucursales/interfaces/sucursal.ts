import { Bodega } from './../../bodegas/models/bodega';
// import { User } from './../../users/interfaces/user';
import { Factura } from '../../facturas/interfaces/factura';
export class Sucursal {
    id: number;
    nombre: string;
    createAt: string;
    direccion: string;
    nit: string;
    propietario: string;
    sede: string;
    regimen: string;
    facebook: string;
    instagram: string;
    geoposicion: string;
    telefono: string;
    celular1: string;
    celular2: string;
    facturas: Array<Factura> = [];
    bodegas: Array<Bodega> = [];
    numeroFactura: number;
    // usuarios: Array<User> = [];
  }
