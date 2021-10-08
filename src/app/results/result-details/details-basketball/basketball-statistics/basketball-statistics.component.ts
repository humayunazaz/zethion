import { Component, OnInit, Input, NgZone } from '@angular/core';

@Component({
  selector: 'app-basketball-statistics',
  templateUrl: './basketball-statistics.component.html',
  styleUrls: ['./basketball-statistics.component.css']
})


export class BasketballStatisticsComponent implements OnInit {

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
