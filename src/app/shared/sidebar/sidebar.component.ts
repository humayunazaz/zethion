import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { SigninService } from "../_service/signin/signin.service";
import { SigninformComponent } from "../signin/signinform/signinform.component";
import { SignindialogComponent } from "../signin/signindialog/signindialog.component";
import { MatDialog } from "@angular/material/dialog";

declare const $: any;

//Metadata
export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  selected: boolean;
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

//Menu Items
export const ROUTES: RouteInfo[] = [{
  path: '/dashboard',
  title: 'Dashboard',
  type: 'link',
  icontype: 'dashboard',
  selected: true,
},
{
  path: '/news',
  title: 'News',
  type: 'link',
  icontype: 'fiber_new',
  selected: false,
},
{
  path: '/results',
  title: 'Results',
  type: 'link',
  icontype: 'subject',
  selected: false,
},
{
  path: '/admin',
  title: 'Admin',
  type: 'link',
  icontype: 'subject',
  selected: false,
},
{
  path: '/onfield-test',
  title: 'Onfield Test',
  type: 'link',
  icontype: 'subject',
  selected: false,
}];


@Component({
  selector: 'app-sidebar-cmp',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  side_clicked: boolean;
  loggedUser: any;
  private vis_view: any;

  mouseOverState = false;

  constructor(
    public dialog: MatDialog,
    private signinService: SigninService
  ) { }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  mouseOverEvent() {
    this.mouseOverState = !this.mouseOverState;
  }

  mouseLeaveEvent() {
    this.mouseOverState = !this.mouseOverState;
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.signinService.change.subscribe(loggedUser => {
      this.loggedUser = loggedUser;
    });
  }
  updatePS(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
      const ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
    }
  }
  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }
  newMenuRoute() {
    this.side_clicked = !this.side_clicked;
  }
  hideMenu() {
    this.side_clicked = false;
  }
  gotoItem(index) {
    for (const list of this.menuItems) {
      list.selected = false;
    }
    this.menuItems[index].selected = true;
  }

  openDialog(): void {
    this.vis_view = SigninformComponent;
    const dialogRef = this.dialog.open(SignindialogComponent, {
      width: '97%',
      height: '530px',
      data: { component: this.vis_view }
    });
  }

}
