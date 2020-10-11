import { Bodega } from './../../bodegas/models/bodega';
import { User } from '../../users/interfaces/user';
export class  Reporte {
    id: number;
    nombre: string;
    cantidad: number;
    precioCompra: number;
    descripcion: string;
    usuario: User;
    bodega: Bodega;
    createAt: Date;
    fechaModificado: Date;
}
