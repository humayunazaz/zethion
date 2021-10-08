import { Component, OnInit } from '@angular/core';
import * as CanvasJS from 'src/assets/js/canvasjs.min.js';
import * as Chartist from "chartist";

@Component({
  selector: 'app-ball-possession',
  templateUrl: './ball-possession.component.html',
  styleUrls: ['./ball-possession.component.css']
})
export class BallPossessionComponent implements OnInit {

  // Pie
  public pieChartLabels = ['Chrome', 'Safari'];
  public pieChartData = [40, 60];
  public pieChartType = 'pie';


  public dataPreferences = {
    labels: ['60%', '40%'],
    series: [60, 40],
  };

  public optionsPreferences = {
    height: '140px'
  };

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  constructor() { }


  ngOnInit() {

    // let chart = new CanvasJS.Chart("chartContainer", {
    //   animationEnabled: true,
    //   exportEnabled: true,
    //   title:{
    //     text: "Ball Possession"
    //   },
    //   data: [{
    //     type: "pie",
    //     toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
    //     // indexLabel: "{name} - #percent%",
    //     dataPoints: [
    //       { x: 60, y: 60, name: "home", color: '#006062' },
    //       { x: 40, y: 40, name: "away", color: '#e46a07' },
    //     ]
    //   }]
    // });

    new Chartist.Pie('#chartPreferences', this.dataPreferences, this.optionsPreferences);


    // chart.render();
    // }


  }
}
