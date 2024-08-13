import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertComponent } from '../alert/alert.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,private dialog: MatDialog) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = !!sessionStorage.getItem('username');

    if (!isAuthenticated) {
      // Open the alert dialog
      this.dialog.open(AlertComponent, {
        data: {
          message: 'You need to log in to access this page.'
        }
      }).afterClosed().subscribe(() => {
        // Redirect to login page after closing the alert
        this.router.navigate(['/login']);
      });

      return false;
    }

    return true;
  }
}
