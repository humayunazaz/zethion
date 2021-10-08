import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LikeModalComponent } from './like-modal/like-modal.component';
import { SocialPageModalComponent } from './social-page-modal/social-page-modal.component';

@Component({
  selector: 'app-social-like',
  templateUrl: './social-like.component.html',
  styleUrls: ['./social-like.component.scss']
})
export class SocialLikeComponent implements OnInit {

  @Input() id: number;
  @Input() type: string;
  @Input() socialType: string;
  @Input() isGeneral: boolean = false;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  showModal(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    const ref = this.dialog.open(LikeModalComponent, {
      minWidth: '20%',
      height: 'auto',
      panelClass: 'like-modal',
      backdropClass: 'like-modal-backdrop',
      data: {
        isGeneral: this.isGeneral,
        id: this.id,
        type: this.type,
        socialType: this.socialType
      }
    });

    ref.afterClosed().subscribe(result => {
      console.log('🚀 ~ file: social-like.component.ts ~ line 36 ~ SocialLikeComponent ~ ref.afterClosed ~ result', result);
      if (result && result.socialType && result.socials) {
        this.showSocialMedia(result.socialType, result.socials);
      }
    });
  }

  private showSocialMedia(socialType: string, socials: any): void {
    const ref = this.dialog.open(SocialPageModalComponent, {
      minWidth: '30%',
      height: 'auto',
      panelClass: 'like-modal',
      backdropClass: 'like-modal-backdrop',
      data: {
        selectedSocial: socialType,
        socials
      }
    });

    ref.afterClosed().subscribe(result => {
      if (result && result.isBack) {
        this.showModal()
      }
    });
  }

}
