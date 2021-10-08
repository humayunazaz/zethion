import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { listTagTypes } from 'src/app/model/results.model';
import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { TagsService } from 'src/app/shared/_service/tags/tags.service';
import { AddEditTagComponent } from './add-edit-tag/add-edit-tag.component';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  loading: boolean;
  tagTypes: any = listTagTypes();
  page: number = 0;
  size: number = 25;
  keyword: string;
  type: string;
  tags: any[];

  constructor(
    private dialog: MatDialog,
    private tagService: TagsService
  ) {
    this.loading = false;
    this.keyword = '';
    this.type = 'ALL';
    this.tags = [];
  }

  ngOnInit(): void {
    this.getTags();
  }

  addTag(): void {
    const ref = this.dialog.open(AddEditTagComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      panelClass: 'admin-modal'
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.getTags();
      }
    });
  }

  private getTags(): void {
    this.loading = true;
    this.tagService.getMasterTags(this.page, this.size, this.keyword, this.type).
      subscribe((response: any) => {
        console.log('🚀 ~ file: tags.component.ts ~ line 52 ~ TagsComponent ~ subscribe ~ response', response);
        this.loading = false;
        this.tags = response.content;
      }, error => {
        this.loading = false;
      });
  }

  filter() {
    this.getTags();
  }

  loadNextData() {
    this.page += 1;
    this.getTags();
  }

  loadPreviousData() {
    this.page -= 1;
    this.getTags();
  }

  edit(tag) {
    const ref = this.dialog.open(AddEditTagComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '90%',
      data: {
        tag: {
          ...tag,
          subject: tag.type ? tag[tag.type.toLowerCase()] : null,
        }
      },
      panelClass: 'admin-modal'
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.getTags()
      }
    });
  }

  delete(tag) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'custom-dialog-container admin-modal',
      width: '300px',
      height: '300px',
      data: {
        message: "Are you sure you want to delete"
      },
    })

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.tagService.deleteTag(tag.id).subscribe((res: any) => {
          this.getTags();
        }, error => {
          console.log(error);
        });
      }
    });
  }
}