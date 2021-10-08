import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionAutocompleteComponent } from './competition-autocomplete.component';

describe('CompetitionAutocompleteComponent', () => {
  let component: CompetitionAutocompleteComponent;
  let fixture: ComponentFixture<CompetitionAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitionAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
