import { DALService } from './dal.service';
import { environment } from './../environments/environment';
import { User } from './Models/User';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {  HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  server_url =  environment.API_PROTOCOL + environment.API_SERVER_IP + ":" + environment.API_SERVER_PORT;

  constructor(private router: Router,
              private http : HttpClient,
              private DAL : DALService
            ) { }  


    login(username : string, password : string)  {
      var user = new User();
      user.password = password;
      user.username = username;
  
      return this.http.post(this.server_url + "/api/Login" , user ).toPromise()
      .then((res  ) => {
        localStorage.setItem("JWT" , "Bearer " + res['jwt']);  
        this.DAL.params.Authorization = localStorage.getItem("JWT");      
        this.router.navigate(["search"]);
      })
      .catch(
        (error ) => {
          if(error ) 
            console.log("Login Error" , error);    
        });
    }
} 





