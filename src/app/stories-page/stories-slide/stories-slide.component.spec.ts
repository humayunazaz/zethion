import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesSlideComponent } from './stories-slide.component';

describe('StoriesSlideComponent', () => {
  let component: StoriesSlideComponent;
  let fixture: ComponentFixture<StoriesSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoriesSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
