import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteAutocompleteComponent } from './athlete-autocomplete.component';

describe('AthleteAutocompleteComponent', () => {
  let component: AthleteAutocompleteComponent;
  let fixture: ComponentFixture<AthleteAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
