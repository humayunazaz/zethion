import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-thumb-dialog',
  templateUrl: './thumb-dialog.component.html',
  styleUrls: ['./thumb-dialog.component.scss']
})
export class ThumbDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
