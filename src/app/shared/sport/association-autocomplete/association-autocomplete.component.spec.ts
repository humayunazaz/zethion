import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationAutocompleteComponent } from './association-autocomplete.component';

describe('AssociationAutocompleteComponent', () => {
  let component: AssociationAutocompleteComponent;
  let fixture: ComponentFixture<AssociationAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
