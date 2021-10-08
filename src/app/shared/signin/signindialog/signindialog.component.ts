import { Component, ComponentFactoryResolver, ComponentRef, Inject, ViewChild, ViewContainerRef, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { StorageService } from './../../_service/storage/storage.service';

declare var $: any;

@Component({
  selector: 'app-signindialog',
  templateUrl: './signindialog.component.html'
})

export class SignindialogComponent implements OnInit, OnDestroy {

  @ViewChild('target', { static: true, read: ViewContainerRef }) vcRef: ViewContainerRef;

  componentRef: ComponentRef<any>;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<SignindialogComponent>,
    private resolver: ComponentFactoryResolver,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storageService: StorageService) { }

  ngOnInit() {
    console.log(this.data.component);
    const factory = this.resolver.resolveComponentFactory(this.data.component);
    this.componentRef = this.vcRef.createComponent(factory);
    this.storageService.setToken('');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  getTitleSignInDialog() {
    return 'Sign In';
  }

}

