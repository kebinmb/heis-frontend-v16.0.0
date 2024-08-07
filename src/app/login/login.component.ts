import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(private loginService:LoginService,private routes:Router){}
  
  
  onLogin() {
    this.loginService.loginAuthentication(this.username, this.password).subscribe(
      {
        next:(response:any) =>
          {
            const hashedUsername = CryptoJS.SHA256(response.username).toString(CryptoJS.enc.Hex);
            const hashedAccessLevel = CryptoJS.SHA256(response.accessLevel.toString()).toString(CryptoJS.enc.Hex);
            const hashedCampus = CryptoJS.SHA256(response.campus).toString(CryptoJS.enc.Hex);
            const hasedName= CryptoJS.SHA256(response.name).toString(CryptoJS.enc.Hex);
            sessionStorage.setItem("username",hashedUsername);
            sessionStorage.setItem("access_level",hashedAccessLevel.toString());
            sessionStorage.setItem("campus",hashedCampus);
            sessionStorage.setItem("name",hasedName);
            this.routes.navigate(["/dashboard"]);
            alert("Login Successful");
          },
        error:(error:any)=>{
          console.log(error)
          alert("Login Failed");
        }

      }
    );
  }
}
