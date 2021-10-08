import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestAutocompleteComponent } from './manifest-autocomplete.component';

describe('ManifestAutocompleteComponent', () => {
  let component: ManifestAutocompleteComponent;
  let fixture: ComponentFixture<ManifestAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManifestAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManifestAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
