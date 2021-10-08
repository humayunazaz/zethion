import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaAutocompleteComponent } from './media-autocomplete.component';

describe('MediaAutocompleteComponent', () => {
  let component: MediaAutocompleteComponent;
  let fixture: ComponentFixture<MediaAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
