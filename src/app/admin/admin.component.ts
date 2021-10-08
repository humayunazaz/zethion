import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Location } from "@angular/common";

import { DataService } from "../shared/_service/data/data.service";
import {SocialService} from "../shared/_service/social/social.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  vidComp: boolean;

  constructor(
    protected data: DataService,
  ) {
  }

  ngOnInit(): void {
    this.data.getVideoCompleted().subscribe(vidEnd => {
      this.vidComp = vidEnd;
    });
  }

}
