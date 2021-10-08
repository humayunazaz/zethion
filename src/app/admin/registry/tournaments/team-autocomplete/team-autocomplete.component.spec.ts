import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAutocompleteComponent } from './team-autocomplete.component';

describe('TeamAutocompleteComponent', () => {
  let component: TeamAutocompleteComponent;
  let fixture: ComponentFixture<TeamAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
