import { Component, OnInit, Inject, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FbServiceWrapperService } from '../fb-service-wrapper.service';
import { FBPostComponent } from 'ngx-facebook';

@Component({
  selector: 'app-fbdialog',
  templateUrl: './fbdialog.component.html',
  styleUrls: ['./fbdialog.component.scss']
})
export class FbdialogComponent implements OnInit, AfterViewInit {
  @ViewChild(FBPostComponent) fbComponent;
  baseUrl = 'https://facebook.com/';
  constructor(
    public dialogRef: MatDialogRef<FbdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fbServiceWrapper: FbServiceWrapperService,
    private renderer: Renderer2,
    private element: ElementRef,
  ) {
    fbServiceWrapper.init();
    console.log('fbdialog', data);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const postUrl = `${this.baseUrl}${this.data.socialPageName}/news/posts/${this.data.postId}`;
    if (this.fbComponent) {
      this.renderer.setAttribute(this.fbComponent.nativeElement, 'data-href', postUrl + "&embedded=true");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
