import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingDocketComponent } from './billing-docket.component';

describe('BillingDocketComponent', () => {
  let component: BillingDocketComponent;
  let fixture: ComponentFixture<BillingDocketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingDocketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingDocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
