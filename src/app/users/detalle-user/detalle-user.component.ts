import { FuncionesService } from './../../generales/services/funciones.service';
import { Component, Input } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService  } from '../services/user.service';
import { ModalUserService  } from '../services/modal-user.service';
import { HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-detalle-user',
  templateUrl: './detalle-user.component.html',
  styleUrls: ['../../generales/css/modal.css']
})
export class DetalleUserComponent {

  @Input() user: User;
  titulo = 'Detalle Usuarios';
  public fotoSelecionada: File;
  progreso = 0;
  rutaFoto = 'Selecionar Foto';
  public  urlEndPoint: string;

  constructor(
    public  userService: UserService,
    public authService: AuthService,
    public modalUserService: ModalUserService,
    public funcionesService: FuncionesService,
  ) { this.urlEndPoint = `${this.funcionesService.setUrlBase()}`; }

  seleccionarFoto(event) {
    this.fotoSelecionada = event.target.files[0];
    this.progreso = 0;
    if (this.fotoSelecionada.type.indexOf('image') < 0) {
      Swal.fire({
        type: 'error',
        title: 'Error al Subir Selecionar Imagen',
        text: `El archivo debe ser del tipo 'Imagen'`,
        footer: 'Intente de nuevo',
        });
      this.fotoSelecionada = null;
    } else {
      this.rutaFoto = this.fotoSelecionada.name;
    }
  }

  subirFoto() {
    if (!this.fotoSelecionada) {
      this.rutaFoto = 'Selecionar Foto';
      Swal.fire({
        type: 'error',
        title: 'Error al Subir Imagen',
        text: `No ha selecionado una imagen`,
        footer: 'Intente de nuevo',
        });

    } else {
    this.userService.subirFoto(this.fotoSelecionada, this.user.id)
    .subscribe( event => {
      if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
          const response: any = event.body;
          this.user = response.user as User;
          this.modalUserService.notificarUpload.emit(this.user);
          this.rutaFoto = 'Selecionar Foto';
          this.fotoSelecionada = null;
          Swal.fire({
            type: 'success',
            title: 'La Foto se ha subido con Exito!',
            text: response.mensaje,
            footer: '',
            });
          // pendiente meter un time out
          this.progreso = 0;
      }
    });
  }
  }
  cerrarModal() {
    this.modalUserService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
  }
}
