import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  constructor(private router: Router, private snackbar:MatSnackBar) { 
    this.logout();
  }

  private logout() {
   
    sessionStorage.clear();
    this.snackbar.open("Logout Successful", "Close", {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
    
    this.router.navigate(['/login']);
  }
}
