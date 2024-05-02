import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userObj = JSON.parse(currentUser);
      if (userObj.token) {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}
