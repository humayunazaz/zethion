import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeContentComponent } from './youtube-content.component';

describe('YoutubeContentComponent', () => {
  let component: YoutubeContentComponent;
  let fixture: ComponentFixture<YoutubeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YoutubeContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
