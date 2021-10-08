import { Component, OnInit, Input } from '@angular/core';

import { ImagesService } from 'src/app/shared/_service/images/images.service';
import { SportEvent } from 'src/app/model/events.model';
declare interface LogoImage {
  [key: string]: HTMLImageElement;
}
@Component({
  selector: 'app-football-timeline',
  templateUrl: './football-timeline.component.html',
  styleUrls: ['./football-timeline.component.scss']
})
export class FootballTimelineComponent implements OnInit {

  eventDetailFirst: SportEvent[] = [];
  eventDetailSecond: SportEvent[] = [];
  eventDetailFirstOT: SportEvent[] = [];
  eventDetailSecondOT: SportEvent[] = [];
  eventDetailFirstlength: number;
  public images: LogoImage = {};
  constructor(
    private imageService: ImagesService
  ) { }

  @Input() public eventDetail: SportEvent[] = [];
  @Input() public hasOvertime = false;

  ngOnInit() {
    console.log('FootballTimelineComponent: eventDetail:', this.eventDetail);

    this.images = this.imageService.images;

    this.eventDetailFirst = this.preparePeriodEvents(this.eventDetail, '1T', 0, 45);
    this.eventDetailSecond = this.preparePeriodEvents(this.eventDetail, '2T', 45, 45);
    this.eventDetailFirstOT = this.preparePeriodEvents(this.eventDetail, '1OT', 90, 15);
    this.eventDetailSecondOT = this.preparePeriodEvents(this.eventDetail, '2OT', 105, 15);

    console.log('FootballTimelineComponent: eventDetailFirst:', this.eventDetailFirst);
    console.log('FootballTimelineComponent: eventDetailSecond:', this.eventDetailSecond);
    console.log('FootballTimelineComponent: eventDetailFirstOT:', this.eventDetailFirstOT);
    console.log('FootballTimelineComponent: eventDetailSecondOT:', this.eventDetailSecondOT);
  }

  private preparePeriodEvents(
    events: SportEvent[],
    periodId: string,
    periodStartMinute: number,
    periodLengthMinutes: number
  ) {
    const periodEvents: SportEvent[] = events.filter(ele => {
      return ele.time === periodId;
    });
    for (const event of periodEvents) {
      console.log(event);
      console.log(this.images);
      const image = this.images[event.eventname];
      if (image) {
        event.imageUrl = image.src;
      }
    }
    let sortedEvents = this.sortEvents(periodEvents);
    // Empty event to help maintain period length
    const periodEndEvent: SportEvent = {
      eventname: 'separator-event',
      time: periodId,
      minute: periodStartMinute + periodLengthMinutes,
      name: undefined,
      team: undefined,
      between: 0,
      isSeparator: false
    };
    sortedEvents = [...sortedEvents, periodEndEvent];
    this.getBetweenEvents(sortedEvents, periodStartMinute);
    return sortedEvents;
  }

  private sortEvents(events: SportEvent[]) {
    return events.sort((a, b) => {
      return a.minute - b.minute;
    });
  }

  private getBetweenEvents(events: SportEvent[], startTime: number) {
    for (let i = 0; i < events.length; i++) {
      if (i === 0) {
        events[i].between = events[i].minute - startTime;
      } else if (i > 0) {
        events[i].between = events[i].minute - events[i - 1].minute;
      }
    }
  }
}
