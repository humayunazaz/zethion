import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLikeComponent } from './social-like.component';

describe('SocialLikeComponent', () => {
  let component: SocialLikeComponent;
  let fixture: ComponentFixture<SocialLikeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialLikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
