import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  campus:number | null;
  ngOnInit(){
    const encryptedCampusValue = sessionStorage.getItem('campus');

    // Decrypt the campus value
    const decryptedCampusValue = encryptedCampusValue
        ? CryptoJS.AES.decrypt(encryptedCampusValue, 'chmsu.edu.ph.secret-key.secret').toString(CryptoJS.enc.Utf8)
        : null;

    // Convert the decrypted value to a number
    const campusNumber = decryptedCampusValue ? Number(decryptedCampusValue) : null;
    this.campus = campusNumber;
    ////console.log("Decrypted Campus Value:", campusNumber);
  }
}
