import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesContentComponent } from './stories-content.component';

describe('StoriesContentComponent', () => {
  let component: StoriesContentComponent;
  let fixture: ComponentFixture<StoriesContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoriesContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
