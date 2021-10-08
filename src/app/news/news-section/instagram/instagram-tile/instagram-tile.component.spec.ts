import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramTileComponent } from './instagram-tile.component';

describe('InstagramTileComponent', () => {
  let component: InstagramTileComponent;
  let fixture: ComponentFixture<InstagramTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstagramTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
