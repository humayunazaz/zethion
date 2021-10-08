import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../_service/data/data.service';
import { StorageService } from '../_service/storage/storage.service';
import { UpdateRegisterVisitorModal } from '../_service/signin/user-modal';
import { SigninService } from '../_service/signin/signin.service';
import { EventEmitter } from '@angular/core';
import { isEqual } from "lodash-es";
import { sports } from "../const/const"

@Component({
  selector: 'app-sport-menu',
  templateUrl: './sport-menu.component.html',
  styleUrls: ['./sport-menu.component.scss'],
})
export class SportMenuComponent implements OnInit, OnDestroy {

  sports: any;
  sportsColumn: any;
  windowWidthSubscription: Subscription;
  selectedSports: string[];
  preSelectedSports: string[];
  @Output() filterSport: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(
    private dataService: DataService,
    private storageService: StorageService,
    private signinService: SigninService
  ) {
    this.selectedSports = [];
  }

  ngOnInit(): void {
    this.getSports();
  }

  private listenToWindowWidth() {
    this.dataService.windowWidth
      .subscribe((currentWidth) => {
        this.sportsColumn = [];
        if (currentWidth <= 767) {
          for (let i = 0; i < this.sports.length / 2; i += 1) {
            const tempArray = [];
            for (let j = 0; j < 2; j += 1) {
              tempArray.push(this.sports[(j * 16) + i]);
            }
            this.sportsColumn.push(tempArray);
          }
        } else {
          const columns = Math.ceil(this.sports.length / 8);
          for (let i = 0; i < this.sports.length / columns; i += 1) {
            const tempArray = [];
            for (let j = 0; j < columns; j += 1) {
              if (this.sports[(j * 8) + i]) {
                tempArray.push(this.sports[(j * 8) + i]);
              } else {
                tempArray.push(null);
              }
            }
            this.sportsColumn.push(tempArray);
          }
          console.log('🚀 ~ file: sport-menu.component.ts ~ line 54 ~ SportMenuComponent ~ .subscribe ~ this.sportsColumn', this.sportsColumn);
        }
      });
  }

  private getSports(): void {
    this.selectedSports = this.storageService.getSports();
    this.sports = sports.map((sport) => {
      return {
        name: sport,
        isSelected: this.selectedSports.findIndex((selectedSport) => selectedSport === sport) !== -1
      };
    });
    console.log('🚀 ~ file: sport-menu.component.ts ~ line 76 ~ SportMenuComponent ~ this.sports=sports.map ~ this.sports', this.sports);
    this.listenToWindowWidth();
  }

  selectSport(checked: boolean, sportName: string, rowIndex: number, columnIndex: number) {
    if (checked) {
      const sportIndex = this.selectedSports.findIndex((selectedSport) => selectedSport === sportName);
      if (sportIndex === -1) {
        this.selectedSports.push(sportName);
        this.sportsColumn[rowIndex][columnIndex].isSelected = true;
      } else {
        this.selectedSports.splice(sportIndex, 1);
        this.sportsColumn[rowIndex][columnIndex].isSelected = false;
      }
      console.log('🚀 ~ file: sport-menu.component.ts ~ line 74 ~ SportMenuComponent ~ selectSport ~ this.checkSports()', this.checkSports());
      if (!this.checkSports()) {
        if (this.storageService.getClientId()) {
          const updateRegisterUserCookies = new UpdateRegisterVisitorModal(
            this.storageService.getClientId(), this.storageService.getIP(),
            this.storageService.getCountry(), 'USER_SPORT', this.selectedSports);
          updateRegisterUserCookies.setUserCustomizations('DEFAULT_LANGUAGE', [this.storageService.getLanguage()]);
          updateRegisterUserCookies.setUserCustomizations('USER_LANGUAGES', this.storageService.getUserLanguages());
          updateRegisterUserCookies.setUserCustomizations('COUNTRIES', this.storageService.getCountries());
          updateRegisterUserCookies.setUserCookieCustomizations('COOKIE', this.storageService.getCookieConsent());
          this.signinService.updateVisitor(updateRegisterUserCookies).subscribe((response: any) => {
            this.storageService.setSports(this.selectedSports);
          }, err => {
            console.log('the sport cookies couldnt set');
            this.storageService.setSports(this.selectedSports);
          });
        } else {
          console.log('the visitor is not register yet but its values are saved inside the cookies');
          this.storageService.setSports(this.selectedSports);
        }
      }
    }
  }

  private checkSports(): boolean {
    return isEqual(this.preSelectedSports, this.selectedSports);
  }

  filterSports(): void {
    if (!this.checkSports()) {
      this.filterSport.emit(this.selectedSports);
    }
    this.preSelectedSports = [...this.selectedSports];
  }

  ngOnDestroy() {
    if (this.windowWidthSubscription) {
      this.windowWidthSubscription.unsubscribe();
    }
  }

}
