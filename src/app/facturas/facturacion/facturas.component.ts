import { SucursalService } from './../../sucursales/services/sucursal.service';
import { Sucursal } from 'src/app/sucursales/interfaces/sucursal';
import { Component, OnInit } from '@angular/core';
import { Factura } from '../interfaces/factura';
import { ClienteService } from '../../clientes/services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, flatMap } from 'rxjs/operators';
import { FacturaService } from '../services/factura.service';
import { ItemFactura } from '../interfaces/item-factura';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import Swal from 'sweetalert2';
import { Producto } from '../../productos/interfaces/producto';
import { ProductoService } from '../../productos/services/producto.service';
import { AuthService } from '../../users/services/auth.service';
import { UserService } from '../../users/services/user.service';
import { FuncionesService } from '../../generales/services/funciones.service';
import { LoadingService } from '../../generales/services/loading.service';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo: string;
  products = Producto;
  factura: Factura = new Factura();
  errores: string[];
  checked = false;
  facturas: Factura[];
  sucursal: Sucursal;
  numeroFactura: number;
  estadoNumero = false;
  autocompleteControl = new FormControl();

  productosFiltrados: Observable<Producto[]>;

  constructor(
              public  clienteService: ClienteService,
              public sucursalService: SucursalService,
              public  userService: UserService,
              public  facturaService: FacturaService,
              public  productoService: ProductoService,
              public authService: AuthService,
              public  router: Router,
              public  activatedRoute: ActivatedRoute,
              public funcionesService: FuncionesService,
              public loadingService: LoadingService
              ) { }

  ngOnInit() {
    this.loadingService.abrirModal();
    this.sucursal =   JSON.parse(sessionStorage.getItem('sucursal')) as Sucursal;
    this.titulo = `${this.funcionesService.setTitulo()} - Nueva Factura -`;
    this.activatedRoute.paramMap.subscribe(params => {
      const clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId)
      .subscribe(cliente => (this.factura.cliente = cliente));
      this.sucursalService.getSucursal(this.sucursal.id)
      .subscribe(sucursal => (this.factura.sucursal = sucursal, console.log(this.factura)));
      this.userService.getUser(JSON.parse(sessionStorage.getItem('usuario')).id)
      .subscribe(usuario => {this.factura.usuario = usuario,
        this.loadingService.cerrarModal();
      });
      this.cargarUltimaFactura();
    });
    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  cargarUltimaFactura() {
    this.facturaService.getFacturaUltima()
          .subscribe(
           facturas => {this.facturas = facturas,
                         this.facturas.forEach(datos => {
                                                          this.numeroFactura = datos.numeroFactura + 1;
                                                          this.factura.numeroFactura = this.numeroFactura;
                });
            },
          );
  }

  public  _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toUpperCase();
    return this.productoService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    const producto = event.option.value as Producto;
    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      const nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      if (producto.cantidad > 0) {
        this.factura.items.push(nuevoItem);
        // guarda en el localStore
      }
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void {
    const cantidad: number = event.target.value as number;
    if (cantidad <= 0) {
        this.checked = false;
        return this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        // restara cantidad al producto
        if (item.producto.cantidad > 0 && item.cantidad <= item.producto.cantidad) {
          item.cantidad = cantidad;
        } else {
          Swal.fire({
            type: 'error',
            title: 'Oops',
            text: 'La cantidad de Articulos supera al Stock',
            footer: 'Intente de nuevo',
            });
          this.checked = false;
          item.cantidad = 1;
        }
      }
      return item;
    });
  }

  existeItem(id: number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        if (item.producto.cantidad > 0) {
          ++item.cantidad;
        }
      }
      return item;
    });
  }

  eliminarItemFactura(id: number): void {
    this.checked = false;
    this.factura.items = this.factura.items
    .filter((item: ItemFactura) => id !== item.producto.id);
  }

  create(facturaForm): void {
    if (this.factura.items.length === 0) {
      this.autocompleteControl.setErrors({ invalid: true });
    }
    if (facturaForm.form.valid && this.factura.items.length > 0) {
      this.loadingService.abrirModal();
      this.factura.totalGanancia = this.factura.calcularGananciaTotal();
      this.factura.totalFactura = this.factura.calcularGranTotal();
      this.factura.items.forEach((item: ItemFactura) => {
        item.precioComprado = item.producto.precioCompra;
        item.precioVendido = item.producto.precio;
        item.importe = item.producto.precio * item.cantidad;
      } );
      this.cargarUltimaFactura();
      this.facturaService.create(this.factura).subscribe(factura => {
        this.factura.items.forEach((item: ItemFactura) => {
          item.producto.cantidad = item.producto.cantidad - item.cantidad;
          item.producto.fechaVenta = new Date ();
          this.productoService.update(item.producto)
          .subscribe(
            () => {
              Swal.fire({
                type: 'success',
                title: 'Facturado!',
                text: `${factura.descripcion} Creada con éxito!`,
                footer: 'Intente de nuevo',
                });
              this.loadingService.cerrarModal();
              this.router.navigate(['/facturas', factura.id]);
            },
            err => {
              this.errores = err.error.errors as string[],
              this.loadingService.cerrarModal();
            }
          );
        });
      });
    }
  }

  validarDescuento(dato: Factura): string {
    if (dato !== null) {
      if (dato.descuento <= dato.calcularGananciaTotal()) {
        return this.formatNumber(dato.descuento);
      } else {
        dato.descuento = 0;
        Swal.fire({
          type: 'error',
          title: 'Ooops',
          text: `Esta aplicando un descuento que supera la ganancia`,
          footer: 'Intente de nuevo',
          });
        return '0';
      }
    }
  }

  redondearGanancia(): string {
    const ganancia = this.factura.calcularGananciaTotal();
    const gananciaRedondeada = ganancia.toFixed(2);
    return this.formatNumber(parseFloat(gananciaRedondeada));
  }
  redondearPrecioCompra(precioCompra: number): string  {
    const precio = precioCompra.toFixed(2);
    return this.formatNumber(parseFloat(precio));
  }

  formatNumber(cantidad: number): string {
      return this.funcionesService.formatNumber(cantidad);
  }

}
