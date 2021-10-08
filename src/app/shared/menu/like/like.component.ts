import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { LikeModalComponent } from '../../social-like-share/social-like/like-modal/like-modal.component';
import { SocialPageModalComponent } from '../../social-like-share/social-like/social-page-modal/social-page-modal.component';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.css']
})
export class LikeComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  showModal() {
    const ref = this.dialog.open(LikeModalComponent, {
      minWidth: '20%',
      height: 'auto',
      panelClass: 'like-modal',
      backdropClass: 'like-modal-backdrop',
      data: {
        isGeneral: true
      }
    })
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
