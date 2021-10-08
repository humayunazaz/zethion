import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuriositiesSlideComponent } from './curiosities-slide.component';

describe('CuriositiesSlideComponent', () => {
  let component: CuriositiesSlideComponent;
  let fixture: ComponentFixture<CuriositiesSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuriositiesSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuriositiesSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
