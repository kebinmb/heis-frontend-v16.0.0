import { Injectable } from "@angular/core";
import { loadExternalReports, loadExternalReportsSuccess, loadExternalreportsFailure } from './external-report.actions';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ReportsService } from "../reports.service";
import { map, mergeMap } from "rxjs";
@Injectable()
export class ExternalReportsEffects{
    constructor(private actions$:Actions, private reportsService:ReportsService){}
    loadExternalReports$ = createEffect(()=>
    this.actions$.pipe(
        ofType(loadExternalReports),
        mergeMap(action=>
            this.reportsService.getExternalReports(action.month,action.year).pipe(
                map(externalReports =>{
                    if(!Array.isArray(externalReports)){
                        throw new Error ('Expected an array of external reports');
                    }
                    const validExternalReports = externalReports
                    .filter((externalReports:any)=> externalReports && externalReports.documentNumber)
                    .map((externalReports:any)=>({...externalReports}));
                    console.log('Valid external Reports:',validExternalReports);
                    return loadExternalReportsSuccess({externalReports:validExternalReports})
                })
            )
        )
    ));

    
}