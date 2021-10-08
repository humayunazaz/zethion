import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { SocialPageType } from 'src/app/model/social.component.models';
import { SocialService } from 'src/app/shared/_service/social/social.service';

@Component({
  selector: 'app-like-modal',
  templateUrl: './like-modal.component.html',
  styleUrls: ['./like-modal.component.scss']
})
export class LikeModalComponent implements OnInit {

  isGeneral: boolean;
  selectedSocial: string;
  id: number;
  type: string;
  socialType: string;
  socials: any;

  constructor(
    public dialogRef: MatDialogRef<LikeModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private socialService: SocialService
  ) {
    if (this.data && this.data.hasOwnProperty('isGeneral') && this.data.isGeneral) {
      this.isGeneral = this.data.isGeneral;
    }
    if (this.data && this.data.hasOwnProperty('id') && this.data.id) {
      this.id = this.data.id;
    }
    if (this.data && this.data.hasOwnProperty('type') && this.data.type) {
      this.type = this.data.type;
    }
    if (this.data && this.data.hasOwnProperty('socialType') && this.data.socialType) {
      this.socialType = this.data.socialType;
    }
  }

  ngOnInit(): void {
    this.getSocialMaster();
  }

  private getSocialMaster(): void {
    if (!this.isGeneral) {
      if (this.type === 'news') {
        const ids = [this.id, 1];
        this.socialService.getSocials('MEDIA', 0, 10, ids)
          .subscribe((response: any) => {
            console.log('🚀 ~ file: like-modal.component.ts ~ line 43 ~ LikeModalComponent ~ .subscribe ~ response', response);
            this.socials = response.content;
          })
      } else {
        const ids = [this.id, 1];
        forkJoin([
          this.socialService.getSocials('MEDIA', 0, 10, ids),
          this.socialService.getSocials(this.socialType, 0, 10, ids),
        ])
          .subscribe((response: any) => {
            console.log('🚀 ~ file: like-modal.component.ts ~ line 43 ~ LikeModalComponent ~ .subscribe ~ response', response[1].content.find((content) => content.id === this.id));
            this.socials = [response[0].content.find((content) => content.id === 1), response[1].content.find((content) => content.id === this.id)];
          })
      }
    } else {
      const ids = [1, 1];
      this.socialService.getSocials('MEDIA', 0, 10, ids)
        .subscribe((response: any) => {
          console.log('🚀 ~ file: like-modal.component.ts ~ line 43 ~ LikeModalComponent ~ .subscribe ~ response', response);
          this.socials = response.content;
        })
    }
  }

  selectSocial(socialType: string): void {
    this.selectedSocial = socialType;
    this.dialogRef.close({
      socialType,
      socials: this.socials
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
