import { Component, OnInit, Input, NgZone } from '@angular/core';

@Component({
  selector: 'app-basketball-players',
  templateUrl: './basketball-players.component.html',
  styleUrls: ['./basketball-players.component.scss']
})


export class BasketballPlayersComponent implements OnInit {

  //@Input() public players: [];
  @Input() public playersHome: [];
  @Input() public playersAway: [];
  @Input() public detail: [];
  @Input() public rate: number;

  // public rate: number;
  public dataHome: [];
  public dataAway: [];

  ngOnInit() {
    this.setLength(this.playersAway,this.playersHome,this.detail);
    console.log(this.detail);
  }
  constructor(
    private _zone: NgZone,
  ) {
  }
  setLength(playersA,playersH,detail) {
    this.dataHome = playersH
    this.dataAway = playersA
    this.detail=detail
    console.log("Home",this.dataHome)

    console.log("Away",this.dataAway)
    console.log("ddetail",this.detail)
  }

}
