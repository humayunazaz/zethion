import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeTileComponent } from './youtube-tile.component';

describe('YoutubeTileComponent', () => {
  let component: YoutubeTileComponent;
  let fixture: ComponentFixture<YoutubeTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YoutubeTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
