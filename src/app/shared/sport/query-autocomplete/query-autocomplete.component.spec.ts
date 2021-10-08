import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryAutocompleteComponent } from './query-autocomplete.component';

describe('PlaceAutocompleteComponent', () => {
  let component: QueryAutocompleteComponent;
  let fixture: ComponentFixture<QueryAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
