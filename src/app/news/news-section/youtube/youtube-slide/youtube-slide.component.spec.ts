import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeSlideComponent } from './youtube-slide.component';

describe('YoutubeSlideComponent', () => {
  let component: YoutubeSlideComponent;
  let fixture: ComponentFixture<YoutubeSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YoutubeSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
