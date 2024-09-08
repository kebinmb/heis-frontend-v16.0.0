import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  private secretKey: string = 'chmsu.edu.ph.secret-key.secret';
  constructor(private loginService:LoginService,private routes:Router, private snackBar: MatSnackBar){}
  
  ngOnInit(){
    sessionStorage.clear();
  }
  onLogin() {
    this.loginService.loginAuthentication(this.username, this.password).subscribe({
      next: (response: any) => {
        //console.log(response.user.name);
        const encryptedUsername = CryptoJS.AES.encrypt(response.user.username.toString(), this.secretKey).toString();
        const encryptedAccessLevel = CryptoJS.AES.encrypt(response.user.accessLevel.toString(), this.secretKey).toString();
        const encryptedCampus = CryptoJS.AES.encrypt(response.user.campus.toString(), this.secretKey).toString();
        const encryptedName = CryptoJS.AES.encrypt(response.user.name.toString(), this.secretKey).toString();

        sessionStorage.setItem("username", encryptedUsername);
        sessionStorage.setItem("access_level", encryptedAccessLevel);
        sessionStorage.setItem("campus", encryptedCampus);
        sessionStorage.setItem("name", encryptedName);
        this.routes.navigate(["/dashboard"]);
        this.snackBar.open("Login Successful", "Close", {
          duration: 3000, // Duration in milliseconds
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      error: (error: any) => {
        //console.log(error);
        this.snackBar.open("Login Failed", "Close", {
          duration: 3000, // Duration in milliseconds
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }
}
