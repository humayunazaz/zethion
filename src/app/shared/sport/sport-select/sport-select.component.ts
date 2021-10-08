import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { SportService } from '../../_service/sport/sport.service';
import {ALL, GLOBALSPORTS} from "../../../model/sports.model";
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-sport-select',
  templateUrl: './sport-select.component.html',
  styleUrls: ['./sport-select.component.css']
})
export class SportSelectComponent implements OnInit {

  public sports: Array<any> = [];
  public selectedSport: any = '';
  @Input() sportControl: FormControl;
  @Output() selected = new EventEmitter<any>();
  @Output() sportList = new EventEmitter<Array<any>>();
  @Input() hideAll: boolean = false;

  constructor(private sportService: SportService) {
  }

  ngOnInit() {
    if (this.sportControl) {
      this.selectedSport = this.sportControl.value;
    }
    if (this.hideAll == false) {
      this.sports.push(ALL);
    }
    this.getSports();
    this.selected.emit(this.selectedSport);
    this.sportList.emit(this.sports);
    console.log('🚀 ~ file: sport-select.component.ts ~ line 27 ~ SportSelectComponent ~ ngOnInit ~ this.selectedSport', this.selectedSport);
  }

  changeSport(data) {
    this.selectedSport = data;
    this.selected.emit(this.selectedSport);
  }

  getSports() {
    for(const sport of GLOBALSPORTS as any[]){
      this.sports.push(sport);
    }
  }

}
