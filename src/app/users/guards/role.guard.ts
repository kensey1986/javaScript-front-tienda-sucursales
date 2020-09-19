import { Injectable } from '@angular/core';
import { CanActivate,  Router,  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(public authService: AuthService,
              public  router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
        return false;
      }
      // tslint:disable-next-line: no-string-literal
      const role = next.data['role'] as string;
      if (this.authService.hasRole(role)) {
        return true;
      }
      Swal.fire({
        type: 'warning',
        title: 'Acceso Denegado',
        text: `Hola ${this.authService.usuario.username}`,
        footer: 'No tienes acceso a este recurso',
        });
      this.router.navigate(['/clientes']);
      return true;
  }
 }
