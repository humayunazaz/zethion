import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/_service/data/data.service';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss']
})
export class ShareModalComponent implements OnInit {

  shareUrl: string;
  isCopied: boolean;
  isDesktop: boolean;

  constructor(
    public dialogRef: MatDialogRef<ShareModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataService
  ) {
    this.shareUrl = this.data.url;
    this.isCopied = false;
    this.isDesktop = true;
  }

  ngOnInit(): void {
    this.checkDesktop();
  }

  private checkDesktop(): void {
    this.dataService.windowWidth
      .subscribe((currentWidth) => {
        if (currentWidth <= 767) {
          this.isDesktop = false;
        } else {
          this.isDesktop = true;
        }
      });
  }

  copyLink(): void {
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 2000);
  }

  close(): void {
    this.dialogRef.close();
  }

}
