import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAthleteComponent } from './add-edit-athlete.component';

describe('AddEditAthleteComponent', () => {
  let component: AddEditAthleteComponent;
  let fixture: ComponentFixture<AddEditAthleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditAthleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditAthleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
