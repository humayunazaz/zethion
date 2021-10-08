import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {TournamentsService} from '../../_service/tournaments/tournaments.service';
import {Sport} from "../../../match/match.component";
import {OrderPipe} from "../../../results/table-result/table-pipe.pipe";
import {Competition} from "../../../model/competions.model";
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-component-select',
  templateUrl: './competition-select.component.html',
  styleUrls: ['./competition-select.component.css'],
  providers: [OrderPipe]
})
export class CompetitionSelectComponent implements OnChanges, OnInit {

  public competitions: Array<Competition> = [];
  @Input() competitionControl: FormControl;
  @Input() public selectedSport: Sport;
  public selectedCompetition: any = '';
  @Output() selected = new EventEmitter<any>();

  constructor(private tournamentService: TournamentsService) { }

  ngOnInit() {
    if (this.competitionControl) {
      this.selectedCompetition = this.competitionControl.value;
    }
    this.getCompetitions(this.selectedSport);
    this.selected.emit(this.selectedCompetition);
  }

  ngOnChanges() {
    this.getCompetitions(this.selectedSport);
  }

  changeCompetition(data) {
    this.selected.emit(this.competitions.find((competition) => competition.id === data));
  }

  getCompetitions(filter: Sport) {
    this.competitions = [];
    if (filter !== undefined) {
      return this.tournamentService.getCompetitions(filter).subscribe(
        data => {
          console.log('🚀 ~ file: competition-select.component.ts ~ line 47 ~ CompetitionSelectComponent ~ getCompetitions ~ data', data);
          for (let i in data) {
            this.competitions.push(data[i]);
          }
        },
        err => console.error(err)
      );
    }
  }

}
