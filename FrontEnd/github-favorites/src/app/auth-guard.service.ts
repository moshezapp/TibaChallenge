import { JwtHelperService } from '@auth0/angular-jwt';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router/';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router
  ) { }


  canActivate() {  
    if(!localStorage.getItem('JWT'))
    return  false;

    var token = localStorage.getItem('JWT').substring(7);    
    if (!this.jwtHelper.isTokenExpired(token)) 
          return true;
      
    this.router.navigate(['']);  
    return false;  
  }  

}
