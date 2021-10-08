import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalDonateComponent } from './paypal-donate.component';

describe('PaypalDonateComponent', () => {
  let component: PaypalDonateComponent;
  let fixture: ComponentFixture<PaypalDonateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypalDonateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaypalDonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
