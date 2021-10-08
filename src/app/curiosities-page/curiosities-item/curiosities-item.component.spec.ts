import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuriositiesItemComponent } from './curiosities-item.component';

describe('CuriositiesItemComponent', () => {
  let component: CuriositiesItemComponent;
  let fixture: ComponentFixture<CuriositiesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuriositiesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuriositiesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
