import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddEditTagComponent } from 'src/app/admin/tags/add-edit-tag/add-edit-tag.component';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { TagsService } from '../../_service/tags/tags.service';

@Component({
  selector: 'app-manage-tags',
  templateUrl: './manage-tags.component.html',
  styleUrls: ['./manage-tags.component.scss']
})
export class ManageTagsComponent implements OnInit {

  tags: any;
  type: string;

  constructor(
    private tagService: TagsService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.tags = [];
  }

  ngOnInit(): void {
    if (this.data.tags) {
      this.tags = this.data.tags;
    }
    if (this.data.type) {
      this.type = this.data.type;
    }
  }

  delete(tag) {
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
        this.tagService.deleteTag(tag.id).subscribe((res: any) => {
          this.getSubjectTags();
        }, error => {
          console.log(error);
        });
      }
    });
  }

  getSubjectTags(): void {
    this.tagService.getSubjectTags('MEDIA', this.data.subject.id)
      .subscribe((response) => {
        this.tags = response;
      })
  }

  updateValue(event: any, field: string, tag: any): void {
    let value = event.target.value;
    const regex = new RegExp('(https?:\/\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\/\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})');
    if (!regex.test(value)) {
      event.target.value = tag[field];
    } else {
      if (tag[field] !== value) {
        tag[field] = value;
        const data = [{
          keyword: tag.keyword,
          idRef: tag.idRef,
          type: tag.type,
          urlToImage: tag.urlToImage
        }];
        this.tagService.saveTag(data)
          .subscribe((response) => {
            console.log('🚀 ~ file: medias.component.ts ~ line 97 ~ MediasComponent ~ .subscribe ~ response', response);
            this.getSubjectTags();
          }, (error) => {
            console.log('🚀 ~ file: medias.component.ts ~ line 109 ~ MediasComponent ~ .subscribe ~ error', error);
          });
      }
    }
  }

  addTag(): void {
    const ref = this.dialog.open(AddEditTagComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      data: {
        tag: {
          type: this.type,
          sport: this.data.subject.sport,
          subject: this.data.subject
        }
      },
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.getSubjectTags()
      }
    });
  }

}
