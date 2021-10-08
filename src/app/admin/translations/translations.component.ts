import {Component, OnInit} from '@angular/core';
import {TranslateService} from "../../shared/_service/translate/translate.service";
import {LanguageSelection, TranslationPerspective, TranslationPerspectives} from "../../model/translation.component.models";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import { AddTranslationComponent } from './add-translation/add-translation.component';
import { MatDialog } from "@angular/material/dialog";

import {Translation} from "../../shared/_service/translate/translate.model";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {Subject} from "rxjs";

declare const $: any;


@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent implements OnInit {


  page: number = 0;
  size: number = 60;

  data: TranslationPerspective[] = [];
  // filteredData: TranslationPerspective[] = [];
  formFilter: FormGroup;

  codeName: Subject<string> = new Subject();
  code: string = '';

  cluster: string = '';
  clusters: string[];

  languages = LanguageSelection;
  selectedLanguages: string[] = [];
  noFilterLanguage = new FormControl(true);

  loading: boolean = false;
  private _scroll: number = 0;

  constructor(
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    protected translationDailog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.codeName.pipe(debounceTime(300),distinctUntilChanged()).subscribe(value =>{
      this.code = value;
      this.__getTranslations();
    });
    this.formFilter = this.formBuilder.group({
      code: [''],
      cluster: [''],
      language: ['']
    }, {});
    this.__getClusters();
    this.__getTranslations();
  }

  //This calls the getClusterTranslations api and get the data for cluster dropdown
  __getClusters(){
    this.translateService.getClusterTranslations().subscribe((res: any) => {
      this.clusters = res;
      this.clusters.unshift('All');
      },
    error => {
    });
    /*this.translateService.getClustersStub().subscribe((res: any) => {
      this.clusters = res;
      this.clusters.unshift('All')
    })*/
  }

  __getTranslations() {
    this.loading = true;
    let languageFilter = this.selectedLanguages;
    const cluster = this.cluster == 'All'? null : this.cluster;
    this.translateService.getFilterTranslations(
      this.code, cluster, languageFilter, this.page, this.size).subscribe((res: TranslationPerspectives) => {
        this.groupAndPrefity(res.content)
        this.loading = false;
      },
      error => {
        this.loading = false;
      });
  }

  changeCode(event) {
    if (event.toString().length>2) {
      this.codeName.next(event);
    }
  }

  changeCluster(event) {
    this.cluster = event.value;
    this.__getTranslations();
  }

  changeLanguages(event) {
    this.__getTranslations();
  }

  switchNoFilterLangauge(event){
    this.__getTranslations();
  }


  loadNextData() {
    this.page+= 1;
    this.__getTranslations();
  }

  loadPreviousData() {
    this.page-= 1;
    this.__getTranslations();
  }

  async groupAndPrefity(data){
    const field = ['code', 'cluster']
    //Group
    const groupedObj = data.reduce((prev, cur) => {
      if (!prev[`${cur[field[0]]}.${cur[field[1]]}`]) {
        prev[`${cur[field[0]]}.${cur[field[1]]}`] = [cur];
      } else {
        prev[`${cur[field[0]]}.${cur[field[1]]}`].push(cur);
      }
      return prev;
    }, {});


    //Pretify
    const res = Object.keys(groupedObj).map((key, index) => {
      return {
        code: key.split('.')[0],
        cluster: key.split('.')[1],
        languages: groupedObj[key].reduce((prev,cur) => { return { ...prev, [cur['language']]: cur.translatedText} }, {})
      }
    });

    this.data = res;
  }


  addTranslation() {
    const ref = this.translationDailog.open(AddTranslationComponent, {
      minWidth: '60%',
      maxHeight: '100%',
      minHeight: '80%',
      data: {
        languages: this.languages
      },
    })

    ref.afterClosed().subscribe(result => {
      if(result){
        this.__getTranslations()
      }
    });
  }

  valueChanged(value, lang, item){
    const data : Translation = {
      'code': item.code.toUpperCase(),
      'cluster': item.cluster.toUpperCase(),
      'language': lang,
      'translatedText' : value
    };
    this.translateService.saveTranslation(data).subscribe(response => {
      console.log(response)
    }, error => {
      console.log(error)
    });

  }
}
