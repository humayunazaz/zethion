import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditNewsComponent } from './add-edit-news.component';

describe('AddEditNewsComponent', () => {
  let component: AddEditNewsComponent;
  let fixture: ComponentFixture<AddEditNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
