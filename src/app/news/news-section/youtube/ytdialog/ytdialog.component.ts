import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ytdialog',
  templateUrl: './ytdialog.component.html',
  styleUrls: ['./ytdialog.component.scss']
})
export class YtdialogComponent implements OnInit {

  youtubeURL: string;

  constructor(
    public dialogRef: MatDialogRef<YtdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data);
    this.youtubeURL = `https://www.youtube.com/embed/${data.postId}`;
    console.log('🚀 ~ file: ytdialog.component.ts ~ line 19 ~ YtdialogComponent ~ this.youtubeURL', this.youtubeURL);
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
