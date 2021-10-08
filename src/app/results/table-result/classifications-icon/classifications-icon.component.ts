import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-classifications-icon',
  templateUrl: './classifications-icon.component.html',
  styleUrls: ['./classifications-icon.component.scss']
})
export class ClassificationsIconComponent {

  mouseOverState = false;

  constructor(
  ) { }

  mouseOverEvent() {
    this.mouseOverState = !this.mouseOverState;
  }

  mouseLeaveEvent() {
    this.mouseOverState = !this.mouseOverState;
  }

  openClassifications() {
    console.log('Opening classifications');
  }

}
