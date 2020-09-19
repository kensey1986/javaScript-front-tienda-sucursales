import { Region } from '../../regiones/interfaces/region';
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
  roles: string [] = [];

}
