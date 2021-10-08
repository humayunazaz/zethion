import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuriositiesService } from 'src/app/shared/_service/curiosities/curiosities.service';
import { DataService } from 'src/app/shared/_service/data/data.service';
import { CuriositiesItem } from '../models/curiosities-item';
import {StorageService} from "../../shared/_service/storage/storage.service";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-curiosities-item',
  templateUrl: './curiosities-item.component.html',
  styleUrls: ['./curiosities-item.component.scss']
})
export class CuriositiesItemComponent implements OnInit {

  curiosity: CuriositiesItem;
  relatedCuriosities: CuriositiesItem[];
  currentLanguage: string;
  randomAds: SafeHtml[] = [];
  constructor(
    private curiositiesService: CuriositiesService,
    private activatedRoute: ActivatedRoute,
    public dataService: DataService,
    private router: Router,
    private storageService: StorageService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: any) => {
      const curiosityId = params.get('id');
      console.log('🚀 ~ file: story-content.component.ts ~ line 20 ~ StoryContentComponent ~ this.activatedRoute.paramMap.subscribe ~ storyId', curiosityId);
      this.curiosity = null;
      this.getSingleCuriosity(curiosityId);
      this.getRelatedCuriosities(curiosityId);
    });
    this.currentLanguage = this.storageService.getCountry();
    this.curiositiesService.getRandomAds(this.currentLanguage).subscribe(ads => {
      ads.forEach(a => {
        const iframe = this.domSanitizer.bypassSecurityTrustHtml(a.html);
        this.randomAds.push(iframe);
      });
    });
  }

  private getSingleCuriosity(curiosityId: string): void {
    this.curiositiesService.getSingleCuriosity(curiosityId)
      .subscribe((response) => {
        console.log('🚀 ~ file: story-content.component.ts ~ line 28 ~ StoryContentComponent ~ .subscribe ~ response', response);
        this.curiosity = response;
      });
  }

  private getRelatedCuriosities(curiosityId: string): void {
    this.curiositiesService.getRelatedCuriosities(curiosityId)
      .subscribe((response) => {
        console.log('🚀 ~ file: curiosities-item.component.ts ~ line 47 ~ CuriositiesItemComponent ~ .subscribe ~ response', response);
        this.relatedCuriosities = response.slice(0, 4);
      });
  }

  goBack(): void {
    this.router.navigateByUrl('/curiosities');
  }

}
