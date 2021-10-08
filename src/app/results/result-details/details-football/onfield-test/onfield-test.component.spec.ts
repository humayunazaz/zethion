import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnfieldTestComponent } from './onfield-test.component';

describe('OnfieldTestComponent', () => {
  let component: OnfieldTestComponent;
  let fixture: ComponentFixture<OnfieldTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnfieldTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnfieldTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
