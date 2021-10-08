import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuriosityContentComponent } from './curiosity-content.component';

describe('CuriosityContentComponent', () => {
  let component: CuriosityContentComponent;
  let fixture: ComponentFixture<CuriosityContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuriosityContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuriosityContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
