import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesTileComponent } from './stories-tile.component';

describe('StoriesTileComponent', () => {
  let component: StoriesTileComponent;
  let fixture: ComponentFixture<StoriesTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoriesTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
