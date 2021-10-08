import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBasketballComponent } from './details-basketball.component';

describe('DetailsBasketballComponent', () => {
  let component: DetailsBasketballComponent;
  let fixture: ComponentFixture<DetailsBasketballComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsBasketballComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsBasketballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
