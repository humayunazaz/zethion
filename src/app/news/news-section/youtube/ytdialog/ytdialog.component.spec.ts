import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YtdialogComponent } from './ytdialog.component';

describe('YtdialogComponent', () => {
  let component: YtdialogComponent;
  let fixture: ComponentFixture<YtdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YtdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YtdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
