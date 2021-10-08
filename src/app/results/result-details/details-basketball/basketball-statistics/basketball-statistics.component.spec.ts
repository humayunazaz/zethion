import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketballStatisticsComponent } from './basketball-statistics.component';

describe('BasketballStatisticsComponent', () => {
  let component: BasketballStatisticsComponent;
  let fixture: ComponentFixture<BasketballStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasketballStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketballStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
