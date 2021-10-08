import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPreferenceDialogComponent } from './privacy-preference-dialog.component';

describe('PrivacyPreferenceDialogComponent', () => {
  let component: PrivacyPreferenceDialogComponent;
  let fixture: ComponentFixture<PrivacyPreferenceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyPreferenceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPreferenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
