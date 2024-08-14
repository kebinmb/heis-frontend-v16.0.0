import { ChangeDetectorRef, Component } from '@angular/core';
import { ArchiveComponent } from '../dashboard-content/archive/archive.component';
import { NewDocumentComponent } from '../new-document/new-document.component';
import { InstitutionComponent } from '../dashboard-content/institution/institution.component';
import { ReportsComponent } from '../dashboard-content/reports/reports.component';
import { LogsComponent } from '../logs/logs.component';
import { CredentialsComponent } from '../credentials/credentials.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  pageTitle: string = 'Dashboard'; // Initial title or fallback title
  constructor(private cdRef: ChangeDetectorRef) {}
  onActivate(componentReference: any) {
    const componentTitles = {
      [ArchiveComponent.name]: 'Archives',
      [NewDocumentComponent.name]: 'New Document',
      [InstitutionComponent.name]: 'Institution',
      [ReportsComponent.name]:'Reports',
      [LogsComponent.name]:'System Logs',
      [CredentialsComponent.name]:'Credentials'
    };

    const componentName = componentReference.constructor.name;
    if (componentTitles[componentName]) {
      this.pageTitle = componentTitles[componentName];
      this.cdRef.detectChanges(); // Ensure the view updates
    }
  }
}
