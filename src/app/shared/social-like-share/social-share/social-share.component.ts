import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShareModalComponent } from './share-modal/share-modal.component';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss']
})
export class SocialShareComponent implements OnInit {

  @Input() url: string;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  showModal(event): void {
    event.stopPropagation();
    console.log('🚀 ~ file: social-share.component.ts ~ line 15 ~ SocialShareComponent ~ url', this.url);

    const ref = this.dialog.open(ShareModalComponent, {
      minWidth: '20%',
      height: 'auto',
      panelClass: 'share-modal',
      backdropClass: 'share-modal-backdrop',
      data: {
        url: this.url
      }
    });

    ref.afterClosed().subscribe(result => {
    });
  }

}
