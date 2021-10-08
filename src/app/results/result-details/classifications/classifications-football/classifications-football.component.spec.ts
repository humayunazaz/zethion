import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationsFootballComponent } from './classifications-football.component';

describe('ClassificationsFootballComponent', () => {
  let component: ClassificationsFootballComponent;
  let fixture: ComponentFixture<ClassificationsFootballComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationsFootballComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationsFootballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
