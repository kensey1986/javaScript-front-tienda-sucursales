import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate   {

  constructor(public authService: AuthService,
              public  router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
          if (this.authService.isAuthenticated()) {
            if (this.isTokenExpirado()) {
              this.authService.logout();
              this.router.navigate(['/login']);
              return false;
            }
            return true;
          }
          this.router.navigate(['/login']);
          return false;
  }

  isTokenExpirado(): boolean {
    const token = this.authService.token;
    const payload = this.authService.obtenerDatosToken(token);
    const now = new Date().getTime() / 1000;
    if (payload.exp < now) {
      return true;
    }
    return false;
  }

}
