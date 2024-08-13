import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailConfigService {
  private primaryUsername: string = environment.emailConfig.primaryUsername;
  private primaryPassword: string = environment.emailConfig.primaryPassword;
  private secondaryUsername: string = environment.emailConfig.secondaryUsername;
  private secondaryPassword: string = environment.emailConfig.secondaryPassword;
  private usageLimit: number = environment.emailConfig.usageLimit;
  private usageCount: number = 0; // Track the number of usages

  getCredentials(): { username: string; password: string } {
    this.usageCount++;
    if (this.usageCount > this.usageLimit) {
      return {
        username: this.secondaryUsername,
        password: this.secondaryPassword,
      };
    } else {
      return {
        username: this.primaryUsername,
        password: this.primaryPassword,
      };
    }
  }

  resetUsageCount(): void {
    this.usageCount = 0;
  }
}
