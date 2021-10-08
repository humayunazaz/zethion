import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutImagesComponent } from './shortcut-images.component';

describe('ShortcutImagesComponent', () => {
  let component: ShortcutImagesComponent;
  let fixture: ComponentFixture<ShortcutImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortcutImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
