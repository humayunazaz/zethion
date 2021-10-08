import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuriositiesContentComponent } from './curiosities-content.component';

describe('CuriositiesContentComponent', () => {
  let component: CuriositiesContentComponent;
  let fixture: ComponentFixture<CuriositiesContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuriositiesContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuriositiesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
