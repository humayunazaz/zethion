import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationsIconComponent } from './classifications-icon.component';

describe('ClassificationsIconComponent', () => {
  let component: ClassificationsIconComponent;
  let fixture: ComponentFixture<ClassificationsIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationsIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
