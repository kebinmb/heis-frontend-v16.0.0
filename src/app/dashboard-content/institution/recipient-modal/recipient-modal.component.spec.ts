import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientModalComponent } from './recipient-modal.component';

describe('RecipientModalComponent', () => {
  let component: RecipientModalComponent;
  let fixture: ComponentFixture<RecipientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipientModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
