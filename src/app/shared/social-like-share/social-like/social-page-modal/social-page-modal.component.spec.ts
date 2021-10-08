import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialPageModalComponent } from './social-page-modal.component';

describe('SocialPageModalComponent', () => {
  let component: SocialPageModalComponent;
  let fixture: ComponentFixture<SocialPageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialPageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialPageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
