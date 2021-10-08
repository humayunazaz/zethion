import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SocialService } from 'src/app/shared/_service/social/social.service';
@Component({
  selector: 'app-igdialog',
  templateUrl: './igdialog.component.html',
  styleUrls: ['./igdialog.component.scss']
})
export class IgdialogComponent implements OnInit {

  instagramEmbed: string;

  constructor(
    public dialogRef: MatDialogRef<IgdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private socialService: SocialService
  ) {
    console.log(data);
    this.instagramEmbed = `${data.postId}embed/captioned`;
  }

  ngOnInit() {
   
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
