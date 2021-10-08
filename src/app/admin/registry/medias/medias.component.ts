import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { listMediaCountry, listMediaLanguage, listMediaStatus, listMediaType, listTagTypes } from 'src/app/model/results.model';
import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ManageTagsComponent } from 'src/app/shared/sport/manage-tags/manage-tags.component';
import { MediaService } from 'src/app/shared/_service/media/media.service';
import { TagsService } from 'src/app/shared/_service/tags/tags.service';
import { AddMediaComponent } from './add-media/add-media.component';
@Component({
  selector: 'app-medias',
  templateUrl: './medias.component.html',
  styleUrls: ['./medias.component.scss']
})
export class MediasComponent implements OnInit {

  loading: boolean;
  mediaType: any = listMediaType();
  page: number = 0;
  size: number = 25;
  name: string;
  type: string;
  country: string;
  medias: any[];
  countries = listMediaCountry();
  languages = listMediaLanguage();
  statuses = listMediaStatus();
  editNameId: number;
  editUrlId: number;

  constructor(
    private dialog: MatDialog,
    private mediaService: MediaService,
    private tagService: TagsService
  ) {
    this.loading = false;
    this.name = '';
    this.country = 'ALL';
    this.type = 'ALL';
    this.medias = [];
  }

  ngOnInit(): void {
    this.getMedias();
  }

  private getMedias(): void {
    this.loading = true;
    this.mediaService.getMasterMedia(this.page, this.size, this.name, this.country, this.type).
      subscribe((response: any) => {
        console.log('🚀 ~ file: tags.component.ts ~ line 52 ~ TagsComponent ~ subscribe ~ response', response);
        this.loading = false;
        this.medias = response.content;
      }, error => {
        this.loading = false;
      });
  }

  filter() {
    this.getMedias();
  }

  countryChanged(selected) {
    if (selected) {
      this.country = selected;
      this.getMedias();
    }
  }

  loadNextData() {
    this.page += 1;
    this.getMedias();
  }

  loadPreviousData() {
    this.page -= 1;
    this.getMedias();
  }

  addMedia() {
    const ref = this.dialog.open(AddMediaComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      panelClass: 'admin-modal'
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.getMedias();
      }
    });
  }

  updateValue(event: any, field: string, media: any): void {
    let value = event.value;
    if (field === 'name' || field === 'url') {
      value = event.target.value;
    }
    const regex = new RegExp('(https?:\/\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\/\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})');
    if (field === 'name' && !value || field === 'url' && !regex.test(value)) {
      console.log('🚀 ~ file: medias.component.ts ~ line 94 ~ MediasComponent ~ updateValue ~ media', value, field, media);
      event.target.value = media[field];
    } else {
      if (media[field] !== value) {
        media[field] = value;
        this.mediaService.saveMedia(media)
          .subscribe((response) => {
            if (field === 'name') {
              this.editNameId = 0;
            } else if (field === 'url') {
              this.editUrlId = 0;
            }
            console.log('🚀 ~ file: medias.component.ts ~ line 97 ~ MediasComponent ~ .subscribe ~ response', response);
          }, (error) => {
            console.log('🚀 ~ file: medias.component.ts ~ line 109 ~ MediasComponent ~ .subscribe ~ error', error);
          });
      }
    }
  }

  delete(media) {
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
        this.mediaService.deleteMedia(media.id).subscribe((res: any) => {
          this.getMedias();
        }, error => {
          console.log(error);
        });
      }
    });
  }

  addTags(media): void {
    console.log('🚀 ~ file: medias.component.ts ~ line 132 ~ MediasComponent ~ addTags ~ media', media);
    this.tagService.getSubjectTags('MEDIA', media.id)
      .subscribe((response) => {
        console.log('🚀 ~ file: medias.component.ts ~ line 137 ~ MediasComponent ~ .subscribe ~ response', response);
        const ref = this.dialog.open(ManageTagsComponent, {
          minWidth: '60%',
          maxHeight: '100%',
          minHeight: '90%',
          data: {
            subject: media,
            type: 'MEDIA',
            tags: response,
          },
          autoFocus: false,
          panelClass: 'admin-modal'
        });
    
        ref.afterClosed().subscribe(result => {
          if (result) {
            this.getMedias();
          }
        });
      }, (error) => {
        console.log('🚀 ~ file: medias.component.ts ~ line 139 ~ MediasComponent ~ .subscribe ~ error', error);
      });
  }

  toggleName(id): void {
    this.editNameId = id;
  }

  toggleUrl(id): void {
    this.editUrlId = id;
  }

}