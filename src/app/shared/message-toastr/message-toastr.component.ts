import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-toastr',
  templateUrl: './message-toastr.component.html',
  styleUrls: ['./message-toastr.component.scss']
})
export class MessageToastrComponent implements OnInit {

  title: string;
  message: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MessageToastrComponent>
  ) {
    this.title = this.data.title;
    this.message = this.data.message;
  }

  ngOnInit(): void {
  }
  
  close(): void {
    this.dialogRef.close();
  }

}
