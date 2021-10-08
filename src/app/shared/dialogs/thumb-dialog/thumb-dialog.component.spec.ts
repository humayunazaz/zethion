import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbDialogComponent } from './thumb-dialog.component';

describe('ThumbDialogComponent', () => {
  let component: ThumbDialogComponent;
  let fixture: ComponentFixture<ThumbDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
