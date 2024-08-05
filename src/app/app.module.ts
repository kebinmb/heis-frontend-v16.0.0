import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { DocumentDetailsModalComponent } from './dashboard-content/archive/document-details-modal/document-details-modal.component';
import { ArchiveComponent } from './dashboard-content/archive/archive.component';
import { NgxPrintModule } from 'ngx-print';
import { HttpClientModule } from '@angular/common/http';
import { userArchiveReducer } from './dashboard-content/archive/archives-user-state-manager/archives-users.reducer';
import { archiveReducer } from './dashboard-content/archive/archives-state-manager1/archives.reducer';
import { UserArchiveEffects } from './dashboard-content/archive/archives-user-state-manager/archives-users.effects';
import { ArchiveEffects } from './dashboard-content/archive/archives-state-manager1/archives.effects';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { MatListModule } from '@angular/material/list';
import { EmailGroupComponent } from './dashboard-content/email/email-group/email-group.component';
import { EmailMultipleComponent } from './dashboard-content/email/email-multiple/email-multiple.component';
import { EmailIndividualComponent } from './dashboard-content/email/email-individual/email-individual.component';
import { dailyReportReducer, userListReducer } from './dashboard-content/reports/daily-reports-state-manager/daily-report.reducer';
import { userNamesReducer } from './dashboard-content/reports/user-name-state-manager/userName.reducer';
import { monthlyReportsReducer } from './dashboard-content/reports/monthly-reports-state-manager/monthly-reports.reducer';
import { externalReportReducer } from './dashboard-content/reports/external-reports-state-manager/external-report.reducer';
import { departmentUserNamesReducer } from './dashboard-content/reports/external-report-department-username-state-manager/external-report-department-username.reducer';
import { departmentReducer } from './dashboard-content/reports/department-list-state-manager/department-list.reducer';
import { departmentNamesReducer } from './dashboard-content/reports/department-state-manager/departmentname.reducer';
import { institutionReducer } from './dashboard-content/institution/department-list-state-manager/department-list.reducer';
import { userInstitutionReducer } from './dashboard-content/institution/user-institution-list-state-manager/institution-users.reducer';
import { UserInstitutionEffects } from './dashboard-content/institution/user-institution-list-state-manager/institution-users.effects';
import { InstitutionEffects } from './dashboard-content/institution/department-list-state-manager/department-list.effects';
import { DepartmentUserNameEffects } from './dashboard-content/reports/external-report-department-username-state-manager/external-report-department-username.effects';
import { ExternalReportsEffects } from './dashboard-content/reports/external-reports-state-manager/external-report.effects';
import { DepartmentNamesEffect } from './dashboard-content/reports/department-state-manager/departmentname.effects';
import { DepartmentEffects } from './dashboard-content/reports/department-list-state-manager/department-list.effects';
import { MonthlyReportsEffects } from './dashboard-content/reports/monthly-reports-state-manager/monthly-reports.effects';
import { UserNamesEffects } from './dashboard-content/reports/user-name-state-manager/userName.effects';
import { UserEffects } from './dashboard-content/reports/user-list-state-manager/userlist.effects';
import { DailyReportEffects } from './dashboard-content/reports/daily-reports-state-manager/daily-reports.effects';
import { SpinnerComponent } from './spinner/spinner.component';
import { NewDocumentComponent } from './new-document/new-document.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    DocumentDetailsModalComponent,
    ArchiveComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    SpinnerComponent,
    NewDocumentComponent,
    EmailIndividualComponent,
    EmailGroupComponent,
    EmailMultipleComponent
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({
        dailyReport: dailyReportReducer,
        userList: userListReducer,
        userNames: userNamesReducer,
        monthlyReports: monthlyReportsReducer,
        externalReports: externalReportReducer,
        departmentUserNames: departmentUserNamesReducer,
        departmentList: departmentReducer,
        departmentNames: departmentNamesReducer,
        user: userArchiveReducer,
        archives: archiveReducer,
        institution: institutionReducer,
        userInstitution: userInstitutionReducer
    }),
    EffectsModule.forRoot([
        DailyReportEffects, UserEffects, UserNamesEffects, MonthlyReportsEffects, DepartmentEffects, DepartmentNamesEffect, ExternalReportsEffects, DepartmentUserNameEffects, ArchiveEffects, UserArchiveEffects, InstitutionEffects, UserInstitutionEffects
    ]),
    MatDialogModule,
    RouterModule.forRoot(routes),
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatListModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatExpansionModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxPrintModule,
    HttpClientModule,
    MatSnackBarModule,
    MatProgressBarModule
  
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
