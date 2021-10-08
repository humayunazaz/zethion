import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookTileComponent } from './facebook-tile.component';

describe('FacebookTileComponent', () => {
  let component: FacebookTileComponent;
  let fixture: ComponentFixture<FacebookTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
