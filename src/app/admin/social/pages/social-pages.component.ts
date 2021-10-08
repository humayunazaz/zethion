import {Component, OnInit} from '@angular/core';
import {SocialService} from "../../../shared/_service/social/social.service";
import {
  SocialPagePerspective,
  SocialPagePerspectives,
  SocialPageType, SocialPageTypeSelection, SocialSelection
} from "../../../model/social.component.models";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Sport} from "../../../match/match.component";
import {ALL} from "../../../model/sports.model";

declare const $: any;


@Component({
  selector: 'app-social-pages',
  templateUrl: './social-pages.component.html',
  styleUrls: ['./social-pages.component.scss']
})
export class SocialPagesComponent implements OnInit {

  data: SocialPagePerspective[] = [];
  page: number = 0;
  size: number = 25;
  formFilter: FormGroup;
  noFilterSocial = new FormControl(true);
  name: Subject<string> = new Subject();
  queryName; string = "";
  socialTypes = SocialPageTypeSelection;
  socialType: SocialPageType = SocialPageType.ATHLETE;
  socials = SocialSelection;
  selectedSocials = [];
  sport: string = ALL.sport;
  selectedSport: Sport;
  loading: boolean = false;
  private _scroll: number = 0;

  constructor(
    private socialService: SocialService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.name.pipe(debounceTime(300),distinctUntilChanged()).subscribe(value =>{
      this.queryName = value;
      this.__getSocialPages();
    });
    //this.__getSocialPages();
    this.formFilter = this.formBuilder.group({
      name: [''],
      type: [''],
      social: [''],
      noSocial: ['']
    }, {
    });
  }

  __getSocialPages() {
    this.loading = true;
    let socialFilter = null;
    if(this.noFilterSocial.value === false ) {
      socialFilter = this.selectedSocials;
    }
    this.socialService.getSocialMaster(
      this.socialType, socialFilter, this.queryName, this.sport, this.page, this.size
    ).subscribe((res: SocialPagePerspectives) => {
        this.data = res.content; //this.data.concat(res.content);
        this.loading = false;
      },
      error => {
      this.loading = false;
      });
  }

  __refreshSocialPages() {
    this.__resetData();
    this.__getSocialPages();
  }

  __resetData() {
    this.data = [];
    this.page= 0;
  }

  changeName(event) {
    if (event.toString().length>2) {
      this.__resetData();
      this.name.next(event);
    }
  }

  changeType(event) {
    this.socialType = event.value;
    this.__refreshSocialPages();
  }

  changeSocials(event) {
    this.__refreshSocialPages();
  }

  switchNofilterSocial(event) {
    this.__refreshSocialPages();
  }

  sportChanged(selected) {
    this.selectedSport = selected;
    if(this.selectedSport) {
      this.sport = this.selectedSport.sport;
    }
    this.__refreshSocialPages();
  }

  tryAutomaticPagesSetting(item) {
    let res = this.socialService.tryAutomaticPagesSetting(item);
    console.log(res);
  }

  loadNextData() {
    this.page+= 1;
    this.__getSocialPages();
  }

  loadPreviousData() {
    this.page-= 1;
    this.__getSocialPages();
  }

}
