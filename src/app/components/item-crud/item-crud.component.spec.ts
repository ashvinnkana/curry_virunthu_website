import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCrudComponent } from './item-crud.component';

describe('ItemCrudComponent', () => {
  let component: ItemCrudComponent;
  let fixture: ComponentFixture<ItemCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemCrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
