import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-newsdialog',
  templateUrl: './newsdialog.component.html',
  styleUrls: ['./newsdialog.component.scss']
})
export class NewsdialogComponent implements OnInit {

  shareUrl: string;

  constructor(
    public dialogRef: MatDialogRef<NewsdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    if (this.data && !this.data.hasOwnProperty('type')) {
      this.generateShareUrl();
    }
  }

  private generateShareUrl() {
    const url = this.data.url;
    this.shareUrl = `${window.location.origin}/${url}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openLink() {
    window.open(this.data.url);
  }
}
