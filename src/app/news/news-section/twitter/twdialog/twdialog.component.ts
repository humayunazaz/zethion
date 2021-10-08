import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-twdialog',
  templateUrl: './twdialog.component.html',
  styleUrls: ['./twdialog.component.scss']
})
export class TwdialogComponent implements OnInit {

  tweetId: string;

  constructor(
    public dialogRef: MatDialogRef<TwdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log('twitter data', data);
    this.tweetId = data.postId;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
