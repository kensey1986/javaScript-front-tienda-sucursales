import { Producto } from '../../productos/interfaces/producto';
import { User } from '../../users/interfaces/user';
export class  Reporte {
    id: number;
    nombre: string;
    cantidad: number;
    descripcion: string;
    usuario: User;
    producto: Producto;
    createAt: Date;
    fechaModificado: Date;
}
