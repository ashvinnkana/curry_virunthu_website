import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenDocketComponent } from './kitchen-docket.component';

describe('KitchenDocketComponent', () => {
  let component: KitchenDocketComponent;
  let fixture: ComponentFixture<KitchenDocketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KitchenDocketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitchenDocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
