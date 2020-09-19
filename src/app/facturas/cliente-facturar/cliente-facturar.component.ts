import { FuncionesService } from './../../generales/services/funciones.service';
import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map,  flatMap } from 'rxjs/operators';
import { ModalFacturaService } from './../services/modalFactura.service';
import { FormControl } from '@angular/forms';
import { Cliente } from '../../clientes/interfaces/cliente';
import { ClienteService } from '../../clientes/services/cliente.service';

@Component({
  selector: 'app-cliente-facturar',
  templateUrl: './cliente-facturar.component.html',
  styleUrls: ['../../generales/css/modal.css']
})

export class ClienteFacturarComponent implements OnInit {
  id: number;
  cliente: Cliente;
  titulo = 'Buscar Cliente';
  clientesFiltrados: Observable<Cliente[]>;
  autocompleteControl = new FormControl();
  public  urlEndPoint: string;

  constructor(
    public modalFacturaService: ModalFacturaService,
    public  clienteService: ClienteService,
    public funcionesService: FuncionesService,
  ) { this.urlEndPoint = `${this.funcionesService.setUrlBase()}`;  }

  ngOnInit() {
    this.clientesFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  public  _filter(value: string): Observable<Cliente[]> {
    const filterValue = value.toLowerCase();
    return this.clienteService.filtrarClientes(filterValue);
  }

  mostrarNombre(cliente?: Cliente): string | undefined {
    return cliente ? cliente.nombre : undefined;
  }

  seleccionarCliente(event: MatAutocompleteSelectedEvent): void {
    this.cliente = event.option.value as Cliente;
    this.id = this.cliente.id;
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();

  }

  cerrarModal() {
    this.modalFacturaService.cerrarModal();
    this.cliente = null;
  }
}
