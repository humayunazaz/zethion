import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuriositiesTileComponent } from './curiosities-tile.component';

describe('CuriositiesTileComponent', () => {
  let component: CuriositiesTileComponent;
  let fixture: ComponentFixture<CuriositiesTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuriositiesTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuriositiesTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
