import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit, AfterContentInit, ElementRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
// import 'rxjs/add/operator/filter';
// import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';

import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { environment } from "../../../environments/environment";
// import { NavItem, NavItemType } from '../../table-result/table-results.module';

declare const $: any;

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})

export class AdminLayoutComponent implements OnInit, AfterViewInit {
  // public navItems: NavItem[];
  public loading = true;
  vidComp: boolean;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  url: string;
  location: Location;
  developmentMode = sessionStorage.getItem('env') == 'DEVELOPMENT';
  showVideo: boolean;


  @ViewChild('sidebar') sidebar: any;
  @ViewChild(NavbarComponent) navbar: NavbarComponent;
  constructor(
    private router: Router,
    location: Location,
    private data: DataService,
    private elementRef: ElementRef
  ) {
    this.location = location;
    this.showVideo = false;
  }

  ngOnInit() {
    if (!this.showVideo) {
      this.vidEnded()
    }
    console.log('AdminLayoutComponent.ngAfterContentInit, this.developmentMode:', this.developmentMode);

    // to play video on chrome
    // if(this.developmentMode) {
    //   this.vidEnded();
    // }
    // else {
    console.log(this.elementRef);
    if (this.showVideo) {
      const video = this.elementRef.nativeElement.querySelector('video'); // document.querySelector('video');
      video.addEventListener('loadedmetadata', () => {
        console.log('AdminLayoutComponent.ngOnInit, inside loadedmetadata event handler');
        video.play();
      });
    }
    // }

    const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
    // const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((event: any) => {
      console.log('🚀 ~ file: admin-layout.component.ts ~ line 73 ~ AdminLayoutComponent ~ this.router.events.subscribe ~ event', event);
      if (event instanceof NavigationStart) {
        if (event.url !== this.lastPoppedUrl) {
          this.yScrollStack.push(window.scrollY);
        }
      } else if (event instanceof NavigationEnd) {
        if (event.url === this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        }
      }
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      elemMainPanel.scrollTop = 0;
      //  elemSidebar.scrollTop = 0;
    });
    const html = document.getElementsByTagName('html')[0];
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const ps = new PerfectScrollbar(elemMainPanel);
      // ps = new PerfectScrollbar(elemSidebar);
      // html.classList.add('perfect-scrollbar-on');
    } else {
      // html.classList.add('perfect-scrollbar-off');
    }
  }

  ngAfterViewInit() {
    this.runOnRouteChange();
  }

  // #26 fix
  vidEnded() {
    console.log('video ended');
    document.getElementsByClassName("bg-lyre")[0].classList.add('fade');
    setTimeout(() => {
      document.getElementsByClassName("bg-lyre")[0].classList.remove('fade');
      document.getElementsByClassName("main-panel")[0].classList.add('fadein');
      document.getElementsByClassName("bg-lyre")[0].classList.add('remove');
      this.data.setVideoCompleted(true);
    }, 200);
  }


  public isMap() {
    if (this.location.prepareExternalUrl(this.location.path()) === '/maps/fullscreen' || this.location.prepareExternalUrl(this.location.path()) === '/news') {
      return true;
    } else {
      return false;
    }
  }

  public isNews() {
    // TODO temp trick to avoid old top menu, menu must be always on the bottom as footer menu in news
    return true;
    if (this.location.prepareExternalUrl(this.location.path()) === '/news') {
      return true;
    } else {
      return false;
    }
  }

  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      // const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      let ps = new PerfectScrollbar(elemMainPanel);
      // ps = new PerfectScrollbar(elemSidebar);
      ps.update();
    }
  }

  isMac(): boolean {
    let ret = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      ret = true;
    }
    return ret;
  }
}
