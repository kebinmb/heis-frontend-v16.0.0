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
  private secretKey: string = 'chmsu.edu.ph.secret-key.secret';
  constructor(private loginService:LoginService,private routes:Router){}
  
  
  onLogin() {
    this.loginService.loginAuthentication(this.username, this.password).subscribe(
      {
       
        next:(response:any) =>
          {
            console.log(response.username)
            const encryptedUsername = CryptoJS.AES.encrypt(response.username.toString(), this.secretKey).toString();
            const encryptedAccessLevel = CryptoJS.AES.encrypt(response.accessLevel.toString(), this.secretKey).toString();
            const encryptedCampus = CryptoJS.AES.encrypt(response.campus.toString(), this.secretKey).toString();
            const encryptedName = CryptoJS.AES.encrypt(response.name.toString(), this.secretKey).toString();
    
            sessionStorage.setItem("username", encryptedUsername);
            sessionStorage.setItem("access_level", encryptedAccessLevel);
            sessionStorage.setItem("campus", encryptedCampus);
            sessionStorage.setItem("name", encryptedName);
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
