import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SportSelectComponent } from './sport-select/sport-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TournamentSelectComponent } from './tournament-select/tournament-select.component';
import { TranslateModule } from '@ngx-translate/core';
import { CompetitionSelectComponent } from './competition-select/competition-select.component';
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { CountrySelectComponent } from './country-select/country-select.component';
import { TableResultsModule } from "../../results/table-result/table-results.module";
import { CompetitionAutocompleteComponent } from './competition-autocomplete/competition-autocomplete.component';
import { PeopleAutocompleteComponent } from './people-autocomplete/people-autocomplete.component';
import { MediaAutocompleteComponent } from './media-autocomplete/media-autocomplete.component';
import { AthleteAutocompleteComponent } from './athlete-autocomplete/athlete-autocomplete.component';
import { AssociationAutocompleteComponent } from './association-autocomplete/association-autocomplete.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { Platform } from '@angular/cdk/platform';
import { Overlay } from '@angular/cdk/overlay';
import { ManifestAutocompleteComponent } from './manifest-autocomplete/manifest-autocomplete.component';


export function MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY(overlay: Overlay, platform: Platform) { return () => platform.IOS ? overlay.scrollStrategies.block() : overlay.scrollStrategies.reposition(); }
@NgModule({
  declarations: [
    SportSelectComponent,
    TournamentSelectComponent,
    CompetitionSelectComponent,
    CountrySelectComponent,
    CompetitionAutocompleteComponent,
    PeopleAutocompleteComponent,
    MediaAutocompleteComponent,
    AthleteAutocompleteComponent,
    AssociationAutocompleteComponent,
    ManifestAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    TranslateModule,
    TableResultsModule
  ],
  exports: [
    SportSelectComponent,
    TournamentSelectComponent,
    CompetitionSelectComponent,
    CountrySelectComponent,
    CompetitionAutocompleteComponent,
    PeopleAutocompleteComponent,
    MediaAutocompleteComponent,
    AthleteAutocompleteComponent,
    AssociationAutocompleteComponent,
    ManifestAutocompleteComponent
  ],
  providers: [
    { provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY, deps: [Overlay, Platform], useFactory: MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY }
  ]
})
export class SportModule { }
