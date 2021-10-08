import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketballPlayersComponent } from './basketball-players.component';

describe('BasketballPlayersComponent', () => {
  let component: BasketballPlayersComponent;
  let fixture: ComponentFixture<BasketballPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasketballPlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketballPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
