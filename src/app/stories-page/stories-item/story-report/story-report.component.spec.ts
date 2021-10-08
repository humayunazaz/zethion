import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryReportComponent } from './story-report.component';

describe('StoryReportComponent', () => {
  let component: StoryReportComponent;
  let fixture: ComponentFixture<StoryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
