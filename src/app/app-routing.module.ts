import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchiveComponent } from './dashboard-content/archive/archive.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmailGroupComponent } from './dashboard-content/email/email-group/email-group.component';
import { EmailMultipleComponent } from './dashboard-content/email/email-multiple/email-multiple.component';
import { EmailIndividualComponent } from './dashboard-content/email/email-individual/email-individual.component';
import { ReportsComponent } from './dashboard-content/reports/reports.component';
import { InstitutionComponent } from './dashboard-content/institution/institution.component';
import { RecipientsComponent } from './dashboard-content/institution/recipients/recipients.component';
import { NewDocumentComponent } from './new-document/new-document.component';
import { LoginComponent } from './login/login.component';
import { LogsComponent } from './logs/logs.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { LogoutComponent } from './logout/logout.component';
export const routes: Routes = [
  {
    path: '',
    component: LoginComponent  // Set LoginComponent as the default route
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate:[AuthGuardService],
    children: [
      { path: 'archives', component: ArchiveComponent, canActivate: [AuthGuardService] },
      { path: 'egroup', component: EmailGroupComponent, canActivate: [AuthGuardService] },
      { path: 'eindvidual', component: EmailIndividualComponent, canActivate: [AuthGuardService] },
      { path: 'emultiple', component: EmailMultipleComponent, canActivate: [AuthGuardService] },
      { path: 'reports', component: ReportsComponent, canActivate: [AuthGuardService] },
      { path: 'institutions', component: InstitutionComponent, canActivate: [AuthGuardService] },
      { path: 'recipients', component: RecipientsComponent, canActivate: [AuthGuardService] },
      { path: 'new-document', component: NewDocumentComponent, canActivate: [AuthGuardService] },
      { path: 'logs', component: LogsComponent, canActivate: [AuthGuardService] }
    ]
  },
  { path: 'logout', component: LogoutComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' } // Wildcard route for a 404 page or redirect to home
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
