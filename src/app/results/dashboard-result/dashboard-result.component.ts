import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-dashboard-result',
  templateUrl: './dashboard-result.component.html',
  styleUrls: ['./dashboard-result.component.css']
})
export class DashboardResultComponent implements OnInit, AfterViewInit {

  public config: PerfectScrollbarConfigInterface = {};

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

}
