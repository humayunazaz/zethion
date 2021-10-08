import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SigninformComponent } from '../signin/signinform/signinform.component';
import { SignindialogComponent } from '../signin/signindialog/signindialog.component';
import { SigninService } from '../_service/signin/signin.service';
import { StorageService } from '../_service/storage/storage.service';

declare const $: any;

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  selected: boolean,
  icontype: string;
  collapse?: string;
  children?: ChildrenItems[];
}
export interface ChildrenItems {
  path: string;
  title: string;
  ab: string;
  type?: string;
}

export const ROUTES: RouteInfo[] = [{
  path: 'DashboardID',
  title: 'Dashboard',
  type: 'link',
  icontype: 'dashboard',
  selected: true,
},
{
  path: 'NewsID',
  title: 'News',
  type: 'link',
  icontype: 'fiber_new',
  selected: false,
},
{
  path: 'ResultsID',
  title: 'Results',
  type: 'link',
  icontype: 'subject',
  selected: false,
},
{
  path: 'FantaID',
  title: 'Fanta',
  type: 'link',
  icontype: 'blur_on',
  selected: false,
}];

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})

export class MenubarComponent implements OnInit {

  menu_font: boolean;
  loggedUser: any;
  menu_show: boolean;
  vis_view: any;
  isloggedUser: any;

  constructor(
    private dialog: MatDialog,
    private signinService: SigninService,
    private storageService: StorageService
  ) { }
  public menuItems: any[];

  ngOnInit() {
    this.loggedUser = this.storageService.getLoggedUser();
    this.isloggedUser = this.loggedUser?.username;

    this.signinService.change.subscribe(loggedUser => {
      this.loggedUser = loggedUser;
    });
  }

  hideMenu() {
    this.menu_show = false;
  }

  openDialog(): void {
    this.vis_view = SigninformComponent;
    const dialogRef = this.dialog.open(SignindialogComponent, {
      panelClass: 'custom-dialog-container-no-scroll',
      width: '380px',
      height: '550px',
      data: { component: this.vis_view }
    });
  }

  newMenu() {
    this.menu_show = true;
  }

  gotoItem(index) {
    for (const list of this.menuItems) {
      list.selected = false;
    }
    this.menu_show = false;
    this.menuItems[index].selected = true;
    const path = this.menuItems[index].path;
    $('html, body').animate({
      scrollTop: $('#' + path).offset().top
    }, 500);
  }
}
