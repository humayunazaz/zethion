import { Component, OnInit, Input, NgZone } from '@angular/core';

@Component({
  selector: 'app-football-statistics',
  templateUrl: './football-statistics.component.html',
  styleUrls: ['./football-statistics.component.css']
})


export class FootballStatisticsComponent implements OnInit {

  @Input() public detail: [];
  @Input() public rate: number;

  // public rate: number;
  public data: [];

  ngOnInit() {
    this.setLength(this.detail);
  }
  constructor(
    private _zone: NgZone,
  ) {
  }
  setLength(data) {
    this.data = data

  }
}
