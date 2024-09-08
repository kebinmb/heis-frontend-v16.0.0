import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ReportsService } from '../reports.service';
import {
  loadDailyReports,
  loadDailyReportsSuccess,
  loadDailyReportsFailure
} from '../daily-reports-state-manager/daily-report.actions';

@Injectable()
export class DailyReportEffects {
  loadDailyReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDailyReports),
      mergeMap(action =>
        this.reportsService.getDailyReports(action.date).pipe(
          map(reports => {
            if (!Array.isArray(reports)) {
              throw new Error('Expected an array of reports');
            }
            const validReports = reports
              .filter((report: any) => report && report.documentNumber)
              .map((report: any) => ({ ...report }));
              // //console.log('Valid Daily Reports:', validReports);
            return loadDailyReportsSuccess({ reports: validReports });
          }),
          catchError(error => of(loadDailyReportsFailure({ error })))
        )
      )
    )
  );



  constructor(
    private actions$: Actions,
    private reportsService: ReportsService
  ) {}
}
