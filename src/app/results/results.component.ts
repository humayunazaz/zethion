import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { SportType } from '../model/sports.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  public loadComponent: SportType = 'FOOTBALL';
  public isMatMenuOpen = false;
  public enteredButton = false;

  constructor(private ren: Renderer2,
    private elementRef: ElementRef) { }

  ngOnInit() {
  }

  loadMyChildComponent(sport: SportType) {
    this.loadComponent = sport;
  }

  buttonEnter(button) {
    this.enteredButton = true;
    this.trigger.openMenu();
    this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
    this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
  }

  buttonLeave(button) {
    setTimeout(() => {
      if (this.isMatMenuOpen == false) {
        this.trigger.closeMenu();
        this.enteredButton = false;
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.enteredButton = false;
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      }
    }, 300);
  }

  menuenter(button) {
    this.isMatMenuOpen = true;
    this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
    this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
  }

  menuLeave(button) {
    setTimeout(() => {
      if (this.enteredButton == true) {
        this.isMatMenuOpen = false;
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.trigger.closeMenu();
        this.isMatMenuOpen = false;
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      }
    }, 80)
  }
}

