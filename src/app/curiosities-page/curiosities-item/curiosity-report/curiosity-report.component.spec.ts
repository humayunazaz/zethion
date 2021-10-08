import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuriosityReportComponent } from './curiosity-report.component';

describe('CuriosityReportComponent', () => {
  let component: CuriosityReportComponent;
  let fixture: ComponentFixture<CuriosityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuriosityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuriosityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
