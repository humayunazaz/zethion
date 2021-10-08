import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleAutocompleteComponent } from './people-autocomplete.component';

describe('PeopleAutocompleteComponent', () => {
  let component: PeopleAutocompleteComponent;
  let fixture: ComponentFixture<PeopleAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
