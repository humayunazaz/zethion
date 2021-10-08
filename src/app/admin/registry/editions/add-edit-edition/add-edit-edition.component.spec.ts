import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEditionComponent } from './add-edit-edition.component';

describe('AddEditEditionComponent', () => {
  let component: AddEditEditionComponent;
  let fixture: ComponentFixture<AddEditEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
