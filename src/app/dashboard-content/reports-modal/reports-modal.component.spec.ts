import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsModalComponent } from './reports-modal.component';

describe('ReportsModalComponent', () => {
  let component: ReportsModalComponent;
  let fixture: ComponentFixture<ReportsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
