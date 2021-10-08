import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ALL, News } from 'src/app/model/sports.model';
import { Sport } from 'src/app/match/match.component';
import { NewsService } from 'src/app/shared/_service/news/news.service';
import { AddEditNewsComponent } from './add-edit-news/add-edit-news.component';
import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { listMediaCountry } from 'src/app/model/results.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  page: number = 0;
  size: number = 25;

  loading: boolean;
  news: News[];

  sport: string = ALL.sport;
  selectedSport: Sport;

  countries = listMediaCountry();
  country: string = ALL.sport;
  selectedCountry: any;


  constructor(
    protected dialog: MatDialog,
    private newsService: NewsService
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.getNews();
  }

  private getNews(): void {
    this.loading = true;
    const sport = this.sport === ALL.sport ? null : this.sport;
    const country = this.country === ALL.sport ? null : this.country;
    this.newsService.getFilterNews(this.page, this.size, sport, country).
      subscribe((response: any) => {
        console.log('🚀 ~ file: tags.component.ts ~ line 52 ~ TagsComponent ~ subscribe ~ response', response);
        this.loading = false;
        this.news = response.content;
      }, error => {
        this.loading = false;
      });
  }

  sportChanged(selected) {
    this.selectedSport = selected;
    if (this.selectedSport) {
      this.sport = this.selectedSport.sport;
      this.getNews();
    }
  }

  countryChanged(event) {
    if (event.value) {
      this.country = event.value;
      this.getNews();
    }
  }

  loadNextData() {
    this.page += 1;
    this.getNews();
  }

  loadPreviousData() {
    this.page -= 1;
    this.getNews();
  }

  addNews(): void {
    const ref = this.dialog.open(AddEditNewsComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      panelClass: 'admin-modal'
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.getNews();
      }
    });
  }

  edit(news: News) {
    this.newsService.getSingleNews(news.id.toString())
      .subscribe((response) => {
        console.log('🚀 ~ file: news.component.ts ~ line 114 ~ NewsComponent ~ .subscribe ~ response', response);
        const ref = this.dialog.open(AddEditNewsComponent, {
          minWidth: '60%',
          maxHeight: '100%',
          minHeight: '90%',
          data: {
            news: response,
            isEdit: true
          },
          panelClass: 'admin-modal'
        })

        ref.afterClosed().subscribe(result => {
          if (result) {
            this.getNews()
          }
        });
      });
  }

  copy(news: News) {
    this.newsService.getSingleNews(news.id.toString())
      .subscribe((response) => {
        console.log('🚀 ~ file: news.component.ts ~ line 114 ~ NewsComponent ~ .subscribe ~ response', response);
        const ref = this.dialog.open(AddEditNewsComponent, {
          minWidth: '60%',
          maxHeight: '100%',
          minHeight: '90%',
          data: {
            news: response,
            isCopy: true
          },
          panelClass: 'admin-modal'
        })

        ref.afterClosed().subscribe(result => {
          if (result) {
            this.getNews()
          }
        });
      });
  }

  delete(news) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '300px',
      height: '300px',
      data: {
        message: "Are you sure you want to delete"
      },
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.newsService.deleteNew(news.id).subscribe((res: any) => {
          this.getNews()
        }, error => {
          console.log(error);
        });
      }
    });
  }


}
