import { AfterViewInit, Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacebookService, InitParams } from 'ngx-facebook';
import { forkJoin } from 'rxjs';
import { SocialService } from 'src/app/shared/_service/social/social.service';

@Component({
  selector: 'app-social-page-modal',
  templateUrl: './social-page-modal.component.html',
  styleUrls: ['./social-page-modal.component.scss']
})
export class SocialPageModalComponent implements OnInit, AfterViewInit, OnDestroy {


  selectedSocial: string;
  facebookDetails: any;
  instagramDetails: any;
  twitterDetails: any;
  youtubeDetails: any;
  socials: any;
  @ViewChild('fbPage1') fbPage1;
  @ViewChild('fbPage2') fbPage2;


  constructor(
    public dialogRef: MatDialogRef<SocialPageModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FacebookService,
    private socialService: SocialService,
    private renderer: Renderer2,
  ) {
    this.selectedSocial = this.data.selectedSocial
    if (this.selectedSocial === 'facebook') {
      let initParams: InitParams = {
        appId: '249701322788476',
        xfbml: true,
        version: 'v8.0'
      };
      this.fb.init(initParams);
    }
    if (this.data.socials) {
      this.socials = this.data.socials;
    }
    this.facebookDetails = [];
    this.instagramDetails = [];
    this.twitterDetails = [];
    this.youtubeDetails = [];
  }

  ngOnInit(): void {
    if (this.selectedSocial === 'youtube') {
      this.youtubeDetails = [this.socials[1] && this.socials[1].pages['YOUTUBE'] ? this.socials[1].pages['YOUTUBE'].socialPageUsername : null, this.socials[0].pages['YOUTUBE'].socialPageId];
      this.loadYouTubeScript();
    } else if (this.selectedSocial === 'instagram') {
      const urls = [];
      const names = [];
      if (this.socials[1] && this.socials[1].pages['INSTAGRAM']) {
        urls.push(this.socials[1].pages['INSTAGRAM'].pageUrl);
        names.push(this.socials[1].pages['INSTAGRAM'].name);
      }
      urls.push(this.socials[0].pages['INSTAGRAM'].pageUrl);
      names.push(this.socials[0].pages['INSTAGRAM'].name);
      this.getInstagramAPI(urls, names);
    } else if (this.selectedSocial === 'twitter') {
      const urls = [];
      const names = [];
      if (this.socials[1] && this.socials[1].pages['TWITTER']) {
        urls.push(this.socials[1].pages['TWITTER'].pageUrl);
        names.push(this.socials[1].pages['TWITTER'].name);
      }
      urls.push(this.socials[0].pages['TWITTER'].pageUrl);
      names.push(this.socials[0].pages['TWITTER'].name);
      this.getTwitterDetails(urls, names);
    }
  }

  ngAfterViewInit() {
    if (this.selectedSocial === 'facebook') {
      if (this.socials[1] && this.socials[1].pages['FACEBOOK']) {
        this.renderer.setAttribute(this.fbPage1.nativeElement, 'data-href', this.socials[1].pages['FACEBOOK'].pageUrl);
      }
      this.renderer.setAttribute(this.fbPage2.nativeElement, 'data-href', this.socials[0].pages['FACEBOOK'].pageUrl);
    }
  }

  private loadYouTubeScript(): void {
    const node = document.createElement('script');
    node.src = 'https://apis.google.com/js/platform.js';
    node.type = 'text/javascript';
    node.async = true;
    node.id = 'youtube-script'
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  private removeYouTubeScript(): void {
    if (this.selectedSocial === 'youtube') {
      const script = document.getElementsByTagName('head')[0].querySelector('#youtube-script');
      document.getElementsByTagName('head')[0].removeChild(script);
    }
  }

  private getInstagramAPI(urls: string[], names: string[]): void {
    const observablesArray = [];
    if (urls[0]) {
      observablesArray.push(this.socialService.getInstagramAPI(urls[0]));
    }
    if (urls[1]) {
      observablesArray.push(this.socialService.getInstagramAPI(urls[1]));
    }
    forkJoin(observablesArray)
      .subscribe((response: any) => {
        console.log('🚀 ~ file: social-page-modal.component.ts ~ line 63 ~ SocialPageModalComponent ~ .subscribe ~ response', response);
        if (response[0]) {
          this.instagramDetails.push({
            name: names[0],
            url: urls[0],
            pic: response[0].graphql.user.profile_pic_url_hd
          });
        }
        if (response[1]) {
          this.instagramDetails.push({
            name: names[1],
            url: urls[1],
            pic: response[1].graphql.user.profile_pic_url_hd
          });
        }
      }, (error) => {
        console.log('🚀 ~ file: social-page-modal.component.ts ~ line 66 ~ SocialPageModalComponent ~ .subscribe ~ error', error);
        if (urls[0]) {
          this.instagramDetails.push({
            name: names[0],
            url: urls[0],
            pic: 'assets/img/instagram-placeholder.png'
          });
        }
        if (urls[1]) {
          this.instagramDetails.push({
            name: names[1],
            url: urls[1],
            pic: 'assets/img/instagram-placeholder.png'
          });
        }
      });
  }

  private getTwitterDetails(urls: string[], names: string[]): void {
    const observablesArray = [];
    if (urls[0]) {
      observablesArray.push(this.socialService.getTwitterProfilePicture(urls[0]));
      this.twitterDetails.push({
        name: names[0],
        url: urls[0],
        pic: '/assets/img/twitter-placeholder.png'
      });
    }
    if (urls[1]) {
      observablesArray.push(this.socialService.getTwitterProfilePicture(urls[1]));
      this.twitterDetails.push({
        name: names[1],
        url: urls[1],
        pic: '/assets/img/twitter-placeholder.png'
      });
    }
    console.log('🚀 ~ file: social-page-modal.component.ts ~ line 127 ~ SocialPageModalComponent ~ getTwitterDetails ~ urls', observablesArray);
    forkJoin(observablesArray)
      .subscribe((response) => {
        console.log('🚀 ~ file: social-page-modal.component.ts ~ line 107 ~ SocialPageModalComponent ~ .subscribe ~ response', response);
        if (response[0]) {
          this.twitterDetails[0].pic = response[0];
        }
        if (response[1]) {
          this.twitterDetails[1].pic = response[1];
        }
      })
  }


  close(): void {
    this.dialogRef.close();
  }

  back(): void {
    this.dialogRef.close({
      isBack: true
    });
  }

  ngOnDestroy() {
    this.removeYouTubeScript();
  }

}
