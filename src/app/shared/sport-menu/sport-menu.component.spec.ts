import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SportMenuComponent } from './sport-menu.component';

describe('SportMenuComponent', () => {
  let component: SportMenuComponent;
  let fixture: ComponentFixture<SportMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SportMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
