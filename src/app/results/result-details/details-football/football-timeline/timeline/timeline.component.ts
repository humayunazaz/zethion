import { Component, OnInit, Input } from '@angular/core';

import { SportEvent } from 'src/app/model/events.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {


  @Input() events: SportEvent[] = [];
  @Input() displaySeparator = false;
  @Input() title = '';

  constructor() { }

  ngOnInit() {
  }

}
