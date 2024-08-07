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
export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      
      { path: 'archives', component:ArchiveComponent},
      { path: 'egroup', component:EmailGroupComponent},
      { path:'eindvidual',component:EmailIndividualComponent},
      { path:'emultiple',component:EmailMultipleComponent},
      { path:'reports',component:ReportsComponent},
      { path:'institutions',component:InstitutionComponent},
      { path:'recipients', component:RecipientsComponent},
      { path:'new-document',component:NewDocumentComponent}
     
      
      
    ]
  },
  { path:'login',component:LoginComponent},
  // { path:'file',component:FileUploadComponent},
  { path: '**', redirectTo: '' } // Wildcard route for a 404 page or redirect to home
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
