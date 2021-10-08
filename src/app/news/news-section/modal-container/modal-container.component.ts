import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NewsService } from 'src/app/shared/_service/news/news.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../shared/_service/data/data.service';
import { FbdialogComponent } from '../facebook/fbdialog/fbdialog.component';
import { SocialService } from '../../../shared/_service/social/social.service';
import { TwdialogComponent } from '../twitter/twdialog/twdialog.component';
import { IgdialogComponent } from '../instagram/igdialog/igdialog.component';
import { YtdialogComponent } from '../youtube/ytdialog/ytdialog.component';
import { NewsdialogComponent } from '../news/newsdialog/newsdialog.component';
import { MetaService } from 'src/app/shared/_service/meta/meta.service';
import { MetaData } from 'src/app/model/meta-data.model';

@Component({
  selector: 'app-modal-container',
  template: ''
})
export class ModalOpeningContainerComponent implements OnInit, OnDestroy {
  constructor(
    private activeRoute: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private searchDialog: MatDialog,
    private socialService: SocialService,
    private newsService: NewsService,
    private metaService: MetaService
  ) {
  }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params: any) => {
      console.log(params);
      const postId = params.get('postId');
      const socialPageName = params.get('title');
      const newsId = params.get('newsId');
      const tweetId = params.get('tweetId');
      const igId = params.get('igId');
      const ytId = params.get('ytId');

      const socialType = this.activeRoute.snapshot.data['socialType'];
      console.log('🚀 ~ file: modal-container.component.ts ~ line 46 ~ ModalOpeningContainerComponent ~ this.activeRoute.paramMap.subscribe ~ socialType', socialType);

      if (socialType === 'facebook') {
        this.dataService.socialType = 'fb';
        this.openFbModal(postId, socialPageName);
      } else if (socialType === 'twitter') {
        this.dataService.socialType = 'tw';
        this.openTwModal(tweetId, socialPageName);
      } else if (socialType === 'instagram') {
        this.dataService.socialType = 'ig';
        this.openIgModal(igId, socialPageName);
      } else if (socialType === 'youtube') {
        this.dataService.socialType = 'yt';
        this.openYtModal(ytId, socialPageName);
      } else if (socialType === 'news') {
        this.dataService.socialType = 'zt';
        this.openSingleNews(newsId);
      }
    });
  }

  ngOnDestroy() {
  }

  openFbModal(postId: string, pageName: string) {
    if (this.dataService.openFbItem) {
      this.openUpTheFbModal(this.dataService.openFbItem, pageName);
    } else {
      this.socialService.getPostById(postId).subscribe((singlePost: any) => {
        const metaData: MetaData = {
          title: singlePost.socialPage.socialPageUsername,
          description: singlePost.description,
          image: singlePost.thumbnail
        }
        this.metaService.setMetaTags(metaData);
        this.openUpTheFbModal(singlePost.postId, pageName);
      });
    }
  }

  openUpTheFbModal(postId: string, pageName: string) {
    const data = {
      postId: postId,
      socialPageName: pageName
    };
    this.dataService.getVideoCompleted().subscribe(videoComplete => {
      if (videoComplete) {
        const ref = this.searchDialog.open(FbdialogComponent, {
          panelClass: 'custom-fbdialog-container',
          data: data,
        });
        ref.afterClosed().subscribe((modalClosed: any) => {
          this.metaService.setDefaultMetaTags();
          this.router.navigate(['/news']);
        });
      }
    });
  }

  openTwModal(tweetId: string, pageName: string) {
    if (this.dataService.openTwItem) {
      this.openUpTheTwModal(this.dataService.openTwItem, pageName);
    } else {
      this.socialService.getPostById(tweetId).subscribe((singlePost: any) => {
        console.log('🚀 ~ file: modal-container.component.ts ~ line 107 ~ ModalOpeningContainerComponent ~ this.socialService.getPostById ~ singlePost', singlePost);
        const metaData: MetaData = {
          title: singlePost.socialPage.socialPageUsername,
          description: singlePost.description,
          image: singlePost.thumbnail ? singlePost.thumbnail : singlePost.urlToMedia
        }
        this.metaService.setMetaTags(metaData);
        this.openUpTheTwModal(singlePost.postId, pageName);
      });
    }
  }

  openUpTheTwModal(postId: string, pageName: string) {
    const data = {
      postId: postId,
      socialPageName: pageName
    };
    this.dataService.getVideoCompleted().subscribe(videoComplete => {
      if (videoComplete) {
        const ref = this.searchDialog.open(TwdialogComponent, {
          panelClass: 'custom-twdialog-container',
          width: '500px',
          data: data,
        });
        ref.afterClosed().subscribe((modalClosed: any) => {
          this.metaService.setDefaultMetaTags();
          this.router.navigate(['/news']);
        });
      }
    });
  }

  openIgModal(igId: string, pageName: string) {
    if (this.dataService.openIgItem) {
      this.openUpTheIgModal(this.dataService.openIgItem, pageName);
    } else {
      this.socialService.getPostById(igId).subscribe((singlePost: any) => {
        const metaData: MetaData = {
          title: singlePost.socialPage.socialPageUsername,
          description: singlePost.description,
          // image: singlePost.thumbnail
        }
        this.metaService.setMetaTags(metaData);
        this.openUpTheIgModal(singlePost.postUrl, pageName);
      });
    }
  }

  openUpTheIgModal(postId: string, pageName: string) {
    const data = {
      postId: postId,
      socialPageName: pageName
    };
    this.dataService.getVideoCompleted().subscribe(videoComplete => {
      if (videoComplete) {
        const ref = this.searchDialog.open(IgdialogComponent, {
          panelClass: 'custom-igdialog-container',
          width: '500px',
          data: data,
        });
        ref.afterClosed().subscribe((modalClosed: any) => {
          this.metaService.setDefaultMetaTags();
          this.router.navigate(['/news']);
        });
      }
    });
  }

  openYtModal(ytId: string, pageName: string) {
    if (this.dataService.openYtItem) {
      this.openUpTheYtModal(this.dataService.openYtItem, pageName);
    } else {
      this.socialService.getPostById(ytId).subscribe((singlePost: any) => {
        const metaData: MetaData = {
          title: singlePost.socialPage.socialPageUsername,
          description: singlePost.description,
          image: singlePost.thumbnail
        }
        this.metaService.setMetaTags(metaData);
        this.openUpTheYtModal(singlePost.postId, pageName);
      });
    }
  }

  openUpTheYtModal(postId: string, pageName: string) {
    const data = {
      postId: postId,
      socialPageName: pageName
    };
    this.dataService.getVideoCompleted().subscribe(videoComplete => {
      if (videoComplete) {
        const ref = this.searchDialog.open(YtdialogComponent, {
            panelClass: 'custom-ytdialog-container',
          width: '1000px',
          data: data,
        });
        ref.afterClosed().subscribe((modalClosed: any) => {
          this.metaService.setDefaultMetaTags();
          this.router.navigate(['/news']);
        });
      }
    });
  }

  openSingleNews(id) {
    if (this.dataService.openNewsItem) {
      this.openNewsModal(this.dataService.openNewsItem);
    } else {
      this.newsService.getSingleNews(id).subscribe((singleNewsDetail: any) => {
        if (singleNewsDetail) {
          this.openNewsModal(singleNewsDetail);
        }
      });
    }
  }

  openNewsModal(item) {
    console.log('🚀 ~ file: modal-container.component.ts ~ line 194 ~ ModalOpeningContainerComponent ~ openNewsModal ~ item', item);
    const metaData: MetaData = {
      title: item.title,
      description: item.description,
      image: item.urlToMedia
    }
    this.metaService.setMetaTags(metaData);
    this.dataService.getVideoCompleted().subscribe(videoEnd => {
      if (videoEnd) {
        const ref = this.searchDialog.open(NewsdialogComponent, {
          minWidth: '80%',
          panelClass: 'custom-dialog-container',
          data: item,
        });
        ref.afterClosed().subscribe((modalClosed: any) => {
          this.metaService.setDefaultMetaTags();
          this.router.navigate(['/news']);
        });
      }
    });
  }

}
