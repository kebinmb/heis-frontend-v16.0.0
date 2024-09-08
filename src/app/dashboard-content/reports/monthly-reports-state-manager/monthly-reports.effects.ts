import { Injectable } from "@angular/core";
import { loadMonthlyReports,loadMonthlyReportsFailure,loadMonthlyReportsSuccess } from "./monthly-reports.actions";
import { Actions,ofType,createEffect } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { ReportsService } from "../reports.service";
@Injectable()
export class MonthlyReportsEffects{
    constructor(
        private actions$: Actions,
        private reportsService: ReportsService
      ) {}
    loadMonthlyReports$ = createEffect(()=>
    this.actions$.pipe(
        ofType(loadMonthlyReports),
        mergeMap(action=>
            this.reportsService.getMonthlyReports(action.month,action.year).pipe(
                map(monthlyReports=>{
                    if(!Array.isArray(monthlyReports)){
                        throw new Error('Expected an array of Monthly Reports');
                    }
                    const validMonthlyreports = monthlyReports
                    .filter((monthlyReports:any)=>monthlyReports && monthlyReports.documentNumber)
                    .map((monthlyReports:any)=>({...monthlyReports}));
                    // //console.log('Valid Monthly Reports:',validMonthlyreports);
                    // //console.log('Monthly Reports Length:',validMonthlyreports.length)
                    return loadMonthlyReportsSuccess({monthlyReports:validMonthlyreports});
                }),
                catchError(error=> of(loadMonthlyReportsFailure({error})))
            )
        )
    )
);
}