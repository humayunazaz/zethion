import { Component, Inject, OnInit } from '@angular/core';
import { Competition } from "../../../../model/competions.model";
import { CompetitionTypeSelect } from "../../../../model/competition-type.model";
import { ParticipationTypeSelection } from "../../../../model/participation-type.model";
import { CompetitionPrestigeSelect } from "../../../../model/competition-prestige.mode";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Sport } from "../../../../match/match.component";
import { Place, Tournament, listYears, listSurfaces, listInOuts, listCurrentLevels } from "../../../../model/results.model";
import moment from "moment";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TournamentsService } from 'src/app/shared/_service/tournaments/tournaments.service';

@Component({
  selector: 'app-add-tournament',
  templateUrl: './add-tournament.component.html',
  styleUrls: ['./add-tournament.component.scss'],

})
export class AddTournamentComponent implements OnInit {

  loading: boolean = false;

  public selectedCompetition: any;
  public selectedPlace: string;
  public selectedYear: number;

  private tournament: Tournament = {
    id: null,
    competition: null,
    place: null,
    startingYear: null,
    date: null
  };

  public selectedSport: Sport;
  competitionTypes: string[] = CompetitionTypeSelect;
  participationTypes: string[] = ParticipationTypeSelection;
  prestiges = CompetitionPrestigeSelect;
  startingYears: any[] = listYears().slice(1); //Removing All
  inOuts: any[] = listInOuts();
  surfaces: any[] = listSurfaces();
  currentLevels: any[] = listCurrentLevels();
  addTournamentForm: FormGroup;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<AddTournamentComponent>,
    private formBuilder: FormBuilder,
    private tournamentsService: TournamentsService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.createForm();
    console.log('🚀 ~ file: add-tournament.component.ts ~ line 56 ~ AddTournamentComponent ~ ngOnInit ~ this.data ', this.data);
    if (this.data && this.data.hasOwnProperty('competition') && this.data.competition) {
      this.setTournamentData();
    }
  }

  private createForm(): void {
    this.addTournamentForm = this.formBuilder.group({
      sport: ['', Validators.required],
      competition: [{ value: '', disabled: true }, Validators.required],
      place: [''],
      startingYear: ['', Validators.required],
      date: [''],
      inOut: [''],
      surface: [''],
      currentLevel: [''],
      partecipants: ['', Validators.pattern('^[0-9]+$')],
      teams: this.formBuilder.array([]),
    });
  }

  private createTeamGroup(): FormGroup {
    return this.formBuilder.group({
      team: ['']
    });
  }

  addTeam(): void {
    const control = this.addTournamentForm.controls.teams as any;
    control.push(this.createTeamGroup());
  }

  removeTeam(index: number): void {
    const control = this.addTournamentForm.controls.teams as any;
    control.removeAt(index);
  }

  removeAll(): void {
    const control = this.addTournamentForm.controls.teams as any;
    while (control.length !== 0) {
      control.removeAt(0)
    }
  }

  getTeamControl() {
    return (this.addTournamentForm.get('teams') as any).controls;
  }

  sportChanged(selected) {
    this.selectedSport = { sport: selected };
    if (selected) {
      this.addTournamentForm.controls.competition.enable();
      if (!this.data.hasOwnProperty('competition')) {
        this.removeAll();
      }
      if (selected === 'TENNIS') {
        this.addTournamentForm.controls.inOut.setValidators([Validators.required]);
        this.addTournamentForm.controls.inOut.updateValueAndValidity();
        this.addTournamentForm.controls.surface.setValidators([Validators.required]);
        this.addTournamentForm.controls.surface.updateValueAndValidity();
        this.addTournamentForm.controls.currentLevel.setValidators([Validators.required]);
        this.addTournamentForm.controls.currentLevel.updateValueAndValidity();
        this.addTournamentForm.controls.partecipants.setValidators([Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])]);
        this.addTournamentForm.controls.partecipants.updateValueAndValidity();
      } else {
        if (!this.data.hasOwnProperty('competition')) {
          this.addTeam();
        }
        this.addTournamentForm.controls.inOut.clearValidators();
        this.addTournamentForm.controls.inOut.updateValueAndValidity();
        this.addTournamentForm.controls.surface.clearValidators();
        this.addTournamentForm.controls.surface.updateValueAndValidity();
        this.addTournamentForm.controls.currentLevel.clearValidators();
        this.addTournamentForm.controls.currentLevel.updateValueAndValidity();
        this.addTournamentForm.controls.partecipants.clearValidators();
        this.addTournamentForm.controls.partecipants.updateValueAndValidity();
      }
    }
  }

  private setTournamentData() {
    this.selectedSport = { sport: this.data.competition.sport };
    this.selectedCompetition = this.data.competition;
    if (this.data.competition.sport !== 'TENNIS') {
      if (this.data.hasOwnProperty('tournament') && this.data.tournament) {
        this.removeAll();
        for (let i = 0; i < this.data.tournament.tournamentTeams.length; i += 1) {
          this.addTeam();
        }
      }
    }
    this.addTournamentForm.patchValue({
      sport: this.data.competition.sport,
      competition: this.data.competition,
      place: this.data.tournament && this.data.tournament.place !== 'ND' ? this.data.tournament.place : '',
      startingYear: this.data.tournament ? this.data.tournament.startingYear || '' : '',
      inOut: this.data.tournament ? this.data.tournament.inOut || '' : '',
      surface: this.data.tournament ? this.data.tournament.surface || '' : '',
      currentLevel: this.data.tournament ? this.data.tournament.currentLevel || '' : '',
      partecipants: this.data.tournament ? this.data.tournament.partecipants || '' : '',
      teams: this.data.tournament ? this.data.tournament.tournamentTeams || [] : []
    });
    console.log('🚀 ~ file: add-tournament.component.ts ~ line 150 ~ AddTournamentComponent ~ setTournamentData ~ this.addTournamentForm', this.addTournamentForm.value);
  }

  competitionChanged(selected) {
    console.log('🚀 ~ file: add-tournament.component.ts ~ line 138 ~ AddTournamentComponent ~ competitionChanged ~ selected', selected);
    if (typeof selected !== 'number') {
      this.selectedCompetition = selected;
    }
  }

  yearChanged(selected) {
    this.selectedYear = selected;
  }

  placeSelected(selected) {
    this.selectedPlace = selected;
  }

  teamSelected(selected) {
    console.log('🚀 ~ file: add-tournament.component.ts ~ line 118 ~ AddTournamentComponent ~ teamSelected ~ selected', selected);
    if (selected) {
      this.addTeam()
    }
  }

  getErrorMessage(pickerInput: string): string {
    if (!pickerInput || pickerInput === '') {
      return 'FORM.DATE_SELECTION';
    }
    return this.isMyDateFormat(pickerInput);
  }

  isMyDateFormat(date: string): string {
    if (date.length !== 10) {
      return 'FORM.DATE_INVALID';
    } else {
      const da = date.split('-');
      if (da.length !== 3 || da[0].length !== 4 || da[1].length !== 2 || da[2].length !== 2) {
        return 'FORM.DATE_INVALID';
      } else if (moment(date).isValid()) {
        return 'FORM.DATE_INVALID_TODAY';
      } else if (!moment(date).isValid()) {
        return 'FORM.DATE_INVALID_ERROR';
      }
    }
    return 'FORM.DATE_INVALID';
  }

  addTournament(): void {
    if (!this.addTournamentForm.valid || !this.addTournamentForm.controls.teams.valid) {
      Object.keys(this.addTournamentForm.controls).forEach(field => {
        const control = this.addTournamentForm.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      const teamsControl = this.addTournamentForm.controls.teams as any;
      teamsControl.controls.forEach((value, key) => {
        Object.keys(teamsControl.controls[key].controls).forEach(field => {
          const control = teamsControl.controls[key].get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      });
    } else {
      this.loading = true;
      let tournamentTeams;
      if (this.addTournamentForm.value.teams && this.addTournamentForm.value.teams.length) {
        const teams = this.addTournamentForm.value.teams.map((ele) => ele.team).filter((ele) => ele);
        tournamentTeams = teams.filter((team, index) => teams.findIndex(data => data.id === team.id) === index).map((team) => {
          return {
            team
          }
        });
      }
      const data = {
        sport: this.addTournamentForm.value.sport,
        competition: this.addTournamentForm.value.competition,
        place: this.addTournamentForm.value.place ? {
          ...this.addTournamentForm.value.place,
          latitude: 0.0,
          longitude: 0.0
        } : {
          placeId: 'ND'
        },
        startingYear: this.addTournamentForm.value.startingYear,
        date: moment(this.addTournamentForm.value.date).format('MM/DD/yyyy'),
        inOut: this.addTournamentForm.value.sport === 'TENNIS' ? this.addTournamentForm.value.inOut : null,
        surface: this.addTournamentForm.value.sport === 'TENNIS' ? this.addTournamentForm.value.surface : null,
        currentLevel: this.addTournamentForm.value.sport === 'TENNIS' ? this.addTournamentForm.value.currentLevel : null,
        // partecipants: this.addTournamentForm.value.sport === 'TENNIS' ? parseInt(this.addTournamentForm.value.participants, 10) : null,
        partecipants: parseInt(this.addTournamentForm.value.participants, 10),
        tournamentTeams
      };
      console.log('🚀 ~ file: add-tournament.component.ts ~ line 232 ~ AddTournamentComponent ~ addTournament ~ data', data);
      this.tournamentsService.saveTournament(data)
        .subscribe((response) => {
          this.loading = false;
          console.log('🚀 ~ file: add-tournament.component.ts ~ line 228 ~ AddTournamentComponent ~ .subscribe ~ response', response);
          this.matDialogRef.close(true);
        }, (error) => {
          this.loading = false;
          console.log('🚀 ~ file: add-tournament.component.ts ~ line 231 ~ AddTournamentComponent ~ .subscribe ~ error', error);
        })
    }
  }



}
