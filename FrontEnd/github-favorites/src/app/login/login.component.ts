import { User } from './../Models/User';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { DALService } from './../dal.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm : any;

  constructor(
    private DAL : DALService,
    private authService : AuthService,
    private formBuilder : FormBuilder,
    private router : Router
  ) { 
    this.LoginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }



  ngOnInit() {
    if(localStorage.getItem("JWT") != null)
      this.router.navigate(["search"]);
  }

  login() {
    var username = this.LoginForm.get('username').value;
    var password = this.LoginForm.get('password').value;

    this.authService.login(username, password);
  }

  Register() {
    var user = new User();
    var username = "";
    var password = "";

    username = window.prompt("Enter username.\nAt least 5 characters\n\n", "my_user_name");
    password = window.prompt("Enter password.\nAt least 5 characters\n\n", "my_p@ssw0rd");
    
    if(username.length < 5 || password.length < 5)
      alert("Not meet the requirements. register again.")
    else {
      user.username = username;
      user.password = password;
  
      this.DAL.Register(user);
    }
  }
}
