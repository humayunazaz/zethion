import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialPagesComponent } from './social-pages.component';


describe('SocialPagesComponent', () => {
  let component: SocialPagesComponent;
  let fixture: ComponentFixture<SocialPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
