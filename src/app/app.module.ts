import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';

import { ClientesComponent } from './clientes/lista-clientes/clientes.component';
import { ClienteService } from './clientes/services/cliente.service';
import { FormClienteComponent } from './clientes/formularios/form-cliente.component';
import { DetalleClienteComponent } from './clientes/detalle-cliente/detalle-cliente.component';


import { UserService } from './users/services/user.service';
import { UsersComponent } from './users/lista-users/users.component';
import { FormUserComponent } from './users/formularios/form-user.component';
import { DetalleUserComponent } from './users/detalle-user/detalle-user.component';


import { ProductoService } from './productos/services/producto.service';
import { ProductosComponent } from './productos/lista-productos/productos.component';
import { FormProductoComponent } from './productos/formularios/form-producto.component';
import { DetalleProductoComponent } from './productos/detalle-producto/detalle-producto.component';
import { ProductoBuscarComponent } from './productos/producto-buscar/producto-buscar.component';



import { RegionService } from './regiones/services/region.service';
import { RegionesComponent } from './regiones/lista-regiones/regiones.component';
import { FormRegionesComponent } from './regiones/formularios/form-regiones.component';
import { DetalleRegionComponent } from './regiones/detalle-region/detalle-region.component';

import { SucursalService } from './sucursales/services/sucursal.service';
import { ListaSucursalesComponent } from './sucursales/lista-sucursales/lista-sucursales.component';
import { DetalleSucursalComponent } from './sucursales/detalle-sucursal/detalle-sucursal.component';
import { FormSucursalesComponent } from './sucursales/formularios/form-sucursales.component';

import { DetalleFacturaComponent } from './facturas/detalle-factura/detalle-factura.component';
import { FacturasComponent } from './facturas/facturacion/facturas.component';

import { ListaFacturasComponent } from './facturas/lista-facturas/lista-facturas.component';
import { ClienteFacturarComponent } from './facturas/cliente-facturar/cliente-facturar.component';
import { FacturaBuscarComponent } from './facturas/buscar-factura-numero/factura-buscar.component';
import { FiltrarFacturasComponent } from './facturas/buscar-por-rango-fecha/filtrar-facturas.component';

import { ListadoReportesComponent } from './reportes/listado-reportes/listado-reportes.component';
import { FormReportesComponent } from './reportes/formularios/form-reportes.component';
import { DetalleReporteComponent } from './reportes/detalle-reporte/detalle-reporte.component';

import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './users/login/login.component';

import { AuthGuard } from './users/guards/auth.guard';
import { RoleGuard } from './users/guards/role.guard';
import { TokenInterceptor } from './users/interceptors/token.interceptor';
import { AuthInterceptor } from './users/interceptors/auth.interceptor';


import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule} from '@angular/material/icon';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';



import localeES from '@angular/common/locales/es';
import { PaginadorComponent } from './generales/paginador/paginador.component';
import { LoadingComponent } from './generales/loading/loading.component';
import { Pagina404Component } from './generales/pagina404/pagina404.component';


import { FilterPipe } from './generales/filter.pipe';

import { BodegasListaComponent } from './bodegas/lista/bodegas-lista.component';
import { BodegasFormularioComponent } from './bodegas/formularios/bodegas-formulario.component';
import { BodegasDetalleComponent } from './bodegas/detalle/bodegas-detalle.component';
import { BoodegasInformeComponent } from './bodegas/informe/bodegas-informe.component';


registerLocaleData(localeES, 'es');
const routes: Routes = [

  {path: '', redirectTo: '/clientes', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},

  {path: 'clientes', component: ClientesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'clientes/details/:id', component: DetalleClienteComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'clientes/page/:page', component: ClientesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'clientes/form', component: FormClienteComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'clientes/form/:id', component: FormClienteComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},

  {path: 'productos', component: ProductosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'productos/page/:page', component: ProductosComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'productos/details/:id', component: DetalleProductoComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'productos/form', component: FormProductoComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'productos/form/:id', component: FormProductoComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},

  {path: 'users', component: UsersComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'users/page/:page', component: UsersComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'users/form', component: FormUserComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'users/form/:id', component: FormUserComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},

  {path: 'regiones', component: RegionesComponent},
  {path: 'regiones/page/:page', component: RegionesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'regiones/form', component: FormRegionesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'regiones/form/:id', component: FormRegionesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},


  {path: 'facturas', component: ListaFacturasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'facturas/page/:page', component: ListaFacturasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'facturas/form/:clienteId', component: FacturasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'facturas/details/:id', component: DetalleFacturaComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'factura/filtrar', component: FiltrarFacturasComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},

  {path: 'sucursales', component: ListaSucursalesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'sucursales/page/:page', component: ListaSucursalesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'sucursales/form', component: FormSucursalesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'sucursales/form/:id', component: FormSucursalesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'sucursales/details/:id', component: DetalleSucursalComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},

  {path: 'reportes', component: ListadoReportesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'reportes/form', component: FormReportesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'reportes/form/:id', component: FormReportesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'reportes/details/:id', component: DetalleReporteComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'sucursales/form/:id', component: FormSucursalesComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},

  {path: 'bodegas', component: BodegasListaComponent},
  {path: 'bodegas/page/:page', component: BodegasListaComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'bodegas/form', component: BodegasFormularioComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'bodegas/form/:id', component: BodegasFormularioComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'bodegas/details/:id', component: BodegasDetalleComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'bodegas/informes', component: BoodegasInformeComponent, canActivate: [ AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},


  {path: '**', component: Pagina404Component},


];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClientesComponent,
    UsersComponent,
    ProductosComponent,
    FormClienteComponent,
    FormUserComponent,
    FormProductoComponent,
    DetalleUserComponent,
    DetalleProductoComponent,
    DetalleClienteComponent,
    RegionesComponent,
    FormRegionesComponent,
    DetalleRegionComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent,
    ListaFacturasComponent,
    ClienteFacturarComponent,
    ProductoBuscarComponent,
    FacturaBuscarComponent,
    FiltrarFacturasComponent,
    PaginadorComponent,
    LoadingComponent,
    Pagina404Component,
    ListaSucursalesComponent,
    DetalleSucursalComponent,
    FormSucursalesComponent,
    ListadoReportesComponent,
    FormReportesComponent,
    DetalleReporteComponent,
    FilterPipe,
    BodegasListaComponent,
    BodegasFormularioComponent,
    BodegasDetalleComponent,
    BoodegasInformeComponent,
  ],
  imports: [


    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatBadgeModule,
    MatRadioModule,
    MatListModule
  ],
  providers: [ClienteService,
              UserService,
              ProductoService,
              RegionService,
              SucursalService,
              {provide: LOCALE_ID, useValue: 'es' },
              { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
