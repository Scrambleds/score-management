import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    if (token && tokenExpiration && new Date() < new Date(tokenExpiration)) {
      localStorage.setItem('redirectPath', state.url); // Store the intended URL for redirection after login
      return true;
    } else {
      localStorage.clear(); // Clear invalid token
      this.router.navigate(['/Login']);
      return false;
    }
  }
}
