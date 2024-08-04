import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyReportsModalComponent } from './monthly-reports-modal.component';

describe('MonthlyReportsModalComponent', () => {
  let component: MonthlyReportsModalComponent;
  let fixture: ComponentFixture<MonthlyReportsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyReportsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlyReportsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
