import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReportModalComponent } from './external-report-modal.component';

describe('ExternalReportModalComponent', () => {
  let component: ExternalReportModalComponent;
  let fixture: ComponentFixture<ExternalReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReportModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExternalReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
