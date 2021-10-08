import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesItemComponent } from './stories-item.component';

describe('StoriesItemComponent', () => {
  let component: StoriesItemComponent;
  let fixture: ComponentFixture<StoriesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoriesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
