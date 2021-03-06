import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { StorageService } from './../_service/storage/storage.service';

declare var $: any;

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private storageService: StorageService
  ) { }

  ngOnInit() {
  }
  confirm() {
    this.dialog.closeAll();
    this.storageService.deleteForgotPassword();
  }

}

