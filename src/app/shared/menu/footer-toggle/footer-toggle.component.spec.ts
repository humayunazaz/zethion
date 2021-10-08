import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterToggleComponent } from './footer-toggle.component';

describe('FooterToggleComponent', () => {
  let component: FooterToggleComponent;
  let fixture: ComponentFixture<FooterToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
